// import SockJS from "sockjs-client"; // Không dùng bù trừ nữa
import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/utils/tokenService";
import env from "@/config/Config";

let stompClient = null;
let messageHandler = null;
let statusHandler = null;
let seenHandler = null;
let currentRoomId = null;
let roomSubscription = null;
let globalSubscription = null;

export const chatSocket = {
  connect(onMessageReceived, onStatusChanged, onMessagesSeen) {
    const token = getAccessToken();

    if (!token) {
      console.warn("Không có token để kết nối socket");
      return;
    }

    messageHandler = onMessageReceived;
    statusHandler = onStatusChanged;
    seenHandler = onMessagesSeen;

    if (stompClient && stompClient.connected) {
      console.log("Socket STOMP đã connect");
      return;
    }

    // Convert http(s) URL to ws(s) URL
    const wsUrl = env.BE_URL.replace(/^http/, 'ws');

    stompClient = new Client({
      // native WebSocket endpoint từ BE
      brokerURL: `${wsUrl}/ws?token=${token}`,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      // Tự động reconnect sau 5s nếu mất mạng
      reconnectDelay: 5000,
      
      // Heartbeat theo chuẩn STOMP
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // debug: (str) => console.log("[STOMP DEBUG]:", str),

      onConnect: () => {
        console.log("STOMP Connected thành công!");

        // ===== LẮNG NGHE STATUS NGƯỜI DÙNG (ONLINE/OFFLINE) =====
        stompClient.subscribe("/topic/users", (msg) => {
          if (msg.body) {
            try {
              const data = JSON.parse(msg.body);
              if (data.event === "user_online") {
                // socket.io style event
                statusHandler?.({ type: "online", userId: data.userId });
              } else if (data.event === "user_offline") {
                // socket.io style event
                statusHandler?.({
                  type: "offline",
                  userId: data.userId,
                  lastSeen: data.lastSeen,
                });
              }
            } catch (err) {
              console.error("Lỗi parse dữ liệu STOMP /topic/users:", err);
            }
          }
        });

        // ===== LẮNG NGHE TIN NHẮN THEO CƠ CHẾ GIAO TIẾP USER QUEUE CỦA SPRING =====
        globalSubscription = stompClient.subscribe("/user/queue/messages", (msg) => {
          if (msg.body) {
            try {
              const data = JSON.parse(msg.body);
              console.log("Nhận tin nhắn từ queue cá nhân:", data);
              messageHandler?.(data);
            } catch (err) {
              console.error("Lỗi parse tin nhắn cá nhân:", err);
            }
          }
        });

        // ===== LẮNG NGHE LỖI TRẢ VỀ TỪ SERVER =====
        stompClient.subscribe("/user/queue/errors", (msg) => {
          console.error("Broker báo lỗi:", msg.body);
        });
      },

      onDisconnect: () => {
        console.log("STOMP Disconnected");
      },

      onStompError: (frame) => {
        console.error("Lỗi Broker STOMP (Lỗi Server trả về):", frame.headers["message"]);
        console.error("Chi tiết frame STOMP error:", frame.body);
      },
    });

    stompClient.activate();
  },

  // ===== JOIN ROOM VÀ LẮNG NGHE TIN NHẮN TỪ ROOM CỤ THỂ (Dự phòng cơ chế Room) =====
  joinRoom(otherUserId, roomId) {
    if (!stompClient || !stompClient.connected) {
      console.warn("STOMP chưa kết nối, không thể joinRoom");
      return;
    }

    // Gửi thông tin để BE biết mình join chat với ai
    stompClient.publish({
      destination: "/app/chat.join",
      body: JSON.stringify({ otherUserId, roomId: roomId || null }),
    });

    // Nếu BE cấp phát `roomId` thì mới lắng nghe cục bộ phòng chat đó
    if (roomId) {
      // Tránh subscribe lại cùng 1 room
      if (currentRoomId === roomId) {
        return;
      }

      // Gỡ bỏ subscription phòng cũ (nếu có)
      if (roomSubscription) {
        roomSubscription.unsubscribe();
        roomSubscription = null;
      }

      currentRoomId = roomId;

      roomSubscription = stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        if (msg.body) {
          try {
            const data = JSON.parse(msg.body);
            // Nếu là event đã xem tin nhắn → gọi seenHandler thay vì messageHandler
            if (data.event === "messages_seen") {
              console.log("Tin nhắn đã được xem bởi:", data.seenByUserId);
              seenHandler?.(data);
            } else {
              console.log("Nhận tin nhắn thông qua room:", data);
              messageHandler?.(data);
            }
          } catch (err) {
            console.error("Lỗi parse dữ liệu nhắn topic room:", err);
          }
        }
      });
    }
  },

  // ===== GỬI TIN NHẮN =====
  sendMessage(content, to, type = "text") {
    if (!stompClient || !stompClient.connected) {
      console.warn("STOMP chưa kết nối, không thể gửi");
      return;
    }

    stompClient.publish({
      destination: "/app/chat.newMessage",
      body: JSON.stringify({
        to,
        content,
        type,
      }),
    });
  },

  // ===== GỬI HEARTBEAT MANUALLY (Dùng thêm nếu STOMP client heartbeat auto chưa đủ) =====
  heartbeat(userId, chatWithId) {
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.publish({
      destination: "/app/chat.heartbeat",
      body: JSON.stringify({ userId, chatWithId }), // Tuỳ params của BE
    });
  },

  // ===== GỬI SEEN REAL-TIME khi đang trong chat và nhận tin nhắn mới từ người kia =====
  sendSeen(otherUserId) {
    if (!stompClient || !stompClient.connected) return;
    stompClient.publish({
      destination: "/app/chat.seen",
      body: JSON.stringify({ otherUserId }),
    });
  },

  disconnect() {
    if (roomSubscription) {
      roomSubscription.unsubscribe();
      roomSubscription = null;
    }
    if (globalSubscription) {
      globalSubscription.unsubscribe();
      globalSubscription = null;
    }

    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
    }

    messageHandler = null;
    statusHandler = null;
    seenHandler = null;
    currentRoomId = null;
  },

  isConnected() {
    return stompClient && stompClient.connected;
  },
};

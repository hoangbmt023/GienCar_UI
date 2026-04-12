import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { chatSocket } from "../../services/chatSocket";
import { chatService } from "../../services/chatService";
import { userService } from "../../services/userService";
import { jwtDecode } from "jwt-decode";
import "./ChatBox.scss";

// Utility để format last seen timestamp
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return `Vừa xong`;
  if (diffMins < 60) return `${diffMins} phút trước`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatBox({ onClose, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUser, setOtherUser] = useState(null); // The selected user object

  // Trạng thái online real-time
  const [onlineUsers, setOnlineUsers] = useState({});

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInitialLoadRef = useRef(true); // Flag để tránh auto-load lúc init

  // Quản lý trạng thái cuộn khi load thêm tin nhắn cũ để tránh khung chat bị "giật" (Flash)
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isFetchingOlderRef = useRef(false);

  useLayoutEffect(() => {
    // Chạy ĐỒNG BỘ ngay sau khi React render xong thay đổi (chưa in ra màn hình)
    if (isFetchingOlderRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const newHeight = container.scrollHeight;

      // Chỉnh lại cuộn một cách tĩnh lặng để bù đắp chiều cao tin nhắn mới
      container.scrollTop =
        newHeight - prevScrollHeightRef.current + prevScrollTopRef.current;

      // Mở khoá trạng thái lấy tin nhắn sau khi đã điều chỉnh hoàn hảo
      isFetchingOlderRef.current = false;
      setIsLoadingMore(false);
    }
  }, [messages]);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới (KHÔNG cuộn khi load old messages)
  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    // Scroll to absolute bottom
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Chỉ scroll to bottom khi có NEW message ở page 1 (không phải load old pages)
    // và đảm bảo scroll AFTER messages đã render
    if (currentPage === 1 && messages.length > 0 && !isInitialLoadRef.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [messages.length, currentPage]);

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.sub);

        // Fetch danh sách hội thoại
        const res = await chatService.getMyConversations();
        if (res.data?.success) {
          setConversations(res.data.data || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi load conversations:", err);
        setLoading(false);
      }
    };

    init();

    // Cleanup
    return () => {
      // No need to cleanup scrollTimeoutRef anymore since we removed debounce
    };
  }, []);

  // ================= SOCKET =================
  useEffect(() => {
    const handleMessage = (msg) => {
      // Nếu đang mở chat với đúng người gửi hoặc nhận, thêm vào messages
      setOtherUser((currentOtherUser) => {
        if (!currentOtherUser) {
          // Nếu chưa chat với ai, load lại danh sách conversations
          fetchConversations();
          return currentOtherUser;
        }

        const msgFrom = String(msg.from?.id || msg.from);
        const msgTo   = String(msg.to?.id   || msg.to);
        const otherId = String(currentOtherUser.id);

        // Chỉ xử lý tin thuộc room đang mở
        if (msgFrom === otherId || msgTo === otherId) {
          setMessages((prev) => {
            // Kiểm tra duplicate: cùng người gửi + nội dung + trong 3 giây
            const isDuplicate = prev.some((m) => {
              const sameFrom = String(m.from?.id || m.from) === msgFrom;
              const sameContent = m.content === msg.content;
              if (!sameFrom || !sameContent) return false;
              if (m.createdAt && msg.createdAt) {
                return Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 3000;
              }
              return true;
            });

            if (!isDuplicate) {
              // Nếu tin này từ người kia gửi đến mình → mark seen ngay (real-time seen)
              if (msgFrom === otherId) {
                chatSocket.sendSeen(currentOtherUser.id);
              }
              return [...prev, msg];
            }
            return prev;
          });
        }
        return currentOtherUser;
      });
    };

    const handleStatusChanged = ({ type, userId, lastSeen }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: type === "online",
      }));

      // Nếu đang chat với user này và mạng báo offline, lập tức cập nhật thời gian lastSeen
      if (type === "offline" && lastSeen) {
        setOtherUser((prevOtherUser) => {
          if (prevOtherUser && String(prevOtherUser.id) === String(userId)) {
            return {
              ...prevOtherUser,
              lastSeen: lastSeen,
            };
          }
          return prevOtherUser;
        });
      }
    };

    const handleSeenEvent = () => {
      // Cập nhật isSeen = true cho tất cả tin nhắn của mình trong room đang mở
      setMessages((prev) =>
        prev.map((m) => {
          const fromId = String(m.from?.id || m.from);
          // Chỉ update tin nhắn của mình (currentUserId là sender)
          if (fromId === String(currentUserId)) {
            return { ...m, isSeen: true };
          }
          return m;
        })
      );
      // Cập nhật lại danh sách hội thoại để xoá badge unread
      fetchConversations();
    };

    chatSocket.connect(handleMessage, handleStatusChanged, handleSeenEvent);

    // ================= GLOBAL HEARTBEAT - Gửi heartbeat liên tục từ lúc connect =================
    const globalHeartbeatInterval = setInterval(() => {
      if (currentUserId && chatSocket.isConnected()) {
        console.log("Global heartbeat tick, userId:", currentUserId);
        chatSocket.heartbeat(currentUserId, null); // Send global heartbeat
      } else {
        console.log("Global heartbeat skip - not ready", {
          currentUserId,
          isConnected: chatSocket.isConnected(),
        });
      }
    }, 10000); // Mỗi 10 giây

    return () => {
      clearInterval(globalHeartbeatInterval);
      // Dọn dẹp connection khi component unmount
      // chatSocket.disconnect(); // Có thể để socket connect tự do hoặc cleanup tùy logic
    };
  }, [currentUserId]);

  // ================= DEBUG: Monitor pagination state =================
  useEffect(() => {
    if (otherUser) {
      console.log("Pagination state:", {
        currentPage,
        hasMore,
        isLoadingMore,
        messagesCount: messages.length,
        otherUserId: otherUser.id,
      });
    }
  }, [currentPage, hasMore, isLoadingMore, messages.length, otherUser]);

  const fetchConversations = async () => {
    try {
      const res = await chatService.getMyConversations();
      if (res.data?.success) {
        setConversations(res.data.data || []);
      }
    } catch (err) {
      console.error("Lỗi load conversations:", err);
    }
  };

  // ================= CHỌN NGƯỜI CHAT =================
  const handleSelectUser = async (user) => {
    // Reset initial load flag khi chọn user mới
    isInitialLoadRef.current = true;

    setOtherUser(user);
    setMessages([]); // reset
    setCurrentPage(1); // Reset page
    setHasMore(true);
    setIsLoadingMore(false); // Ensure not stuck

    // Tìm roomId từ danh sách conversations nếu đã từng chat
    const existingConv = conversations.find(
      (c) => String(c.otherUserId) === String(user.id),
    );
    const roomIdToJoin = existingConv ? existingConv.roomId : null;

    // join realtime với roomId
    chatSocket.joinRoom(user.id, roomIdToJoin);

    // load history messages (trang 1)
    try {
      const res = await chatService.getMessages(user.id, 1, 20);

      if (res.data?.success) {
        const initialMessages = res.data.data || [];
        setMessages(initialMessages);

        // Dùng pagination object từ backend để kiểm tra hasMore
        let hasMorePages = false;
        if (res.data?.pagination) {
          const { page, last } = res.data.pagination;
          hasMorePages = page < last; // Nếu page hiện tại < page cuối → còn page tiếp theo
        } else {
          // Fallback: kiểm tra từ số items trả về
          hasMorePages = initialMessages.length === 20;
        }

        setHasMore(hasMorePages);

        // Cuộn xuống cuối dùng cho lần đầu load tin nhắn (tin nhắn mới nhất ở dưới)
        setTimeout(() => {
          scrollToBottom();

          // Đánh dấu initial load xong sau khi đã cuộn
          // Để tránh việc chưa cuộn xong mà onScroll đã bị gọi (với scrollTop = 0) gây load page 2
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 100);
        }, 50);
      } else {
        console.warn("API success = false");
      }

      // Load initial last seen status and online status
      const seenRes = await userService.getLastSeenUser(user.id);
      if (seenRes.data?.success) {
        const data = seenRes.data.data;
        setOtherUser((prev) => ({
          ...prev,
          lastSeen: data.lastSeen,
        }));
        
        // Cập nhật trạng thái online nếu đang online
        setOnlineUsers((prev) => ({
          ...prev,
          [user.id]: data.isOnline === true,
        }));
      }
    } catch (err) {
      console.error("Error loading initial messages:", err);
    }
  };

  // ================= FOLLOW SELECTED USER FROM SALES MODAL =================
  useEffect(() => {
    if (selectedUser) {
      handleSelectUser(selectedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // REST API polling interval removed. Relying strictly on STOMP socket heartbeat events.

  // ================= LOAD MORE MESSAGES (PAGINATION) =================
  const loadMoreMessages = async () => {
    // Tránh race-condition khi onScroll gọi liên tục: khoá ngay lập tức bằng Ref
    if (isLoadingMore || isFetchingOlderRef.current || !hasMore || !otherUser) {
      return;
    }

    setIsLoadingMore(true);
    isFetchingOlderRef.current = true; // KHOÁ LIỀN LẬP TỨC!

    // Ghi nhớ chiều gốc trước khi load
    const container = messagesContainerRef.current;
    prevScrollHeightRef.current = container ? container.scrollHeight : 0;
    prevScrollTopRef.current = container ? container.scrollTop : 0;

    try {
      const nextPage = currentPage + 1;

      // Tạo độ trễ nhân tạo (400ms) để triệt tiêu quán tính rít chuột của người dúng
      // và cho phép màn hình mượt mà hiển thị trạng thái "Đang tải tin nhắn cũ..." thay vì chớp tắt nhanh.
      const [res] = await Promise.all([
        chatService.getMessages(otherUser.id, nextPage, 20),
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);

      if (res.data?.success) {
        const newMessages = res.data.data || [];
        console.log(
          "Loaded",
          newMessages.length,
          "messages for page",
          nextPage,
        );
        // Trình kích hoạt useLayoutEffect ở trên thông qua Dependency '[messages]'
        setMessages((prev) => [...newMessages, ...prev]);
        setCurrentPage(nextPage);

        let newHasMore = false;
        if (res.data?.pagination) {
          const { page, last } = res.data.pagination;
          newHasMore = page < last;
        } else {
          newHasMore = newMessages.length >= 10;
        }

        setHasMore(newHasMore);
        console.log("Updated hasMore:", newHasMore);

        // Chú ý: Cuộn và giải phóng Loading được thực hiện tự động và ĐỒNG BỘ bên trong useLayoutEffect!
      } else {
        isFetchingOlderRef.current = false;
        setIsLoadingMore(false);
      }
    } catch (err) {
      console.error("Lỗi load more:", err);
      isFetchingOlderRef.current = false;
      setIsLoadingMore(false);
    }
  };

  // ================= SCROLL HANDLER (INFINITE SCROLL) =================
  const handleScroll = () => {
    if (!messagesContainerRef.current || isInitialLoadRef.current) return; // Skip if still initializing

    const { scrollTop } = messagesContainerRef.current;

    // Nếu cuộn lên kịch trần trên cùng (scrollTop chạm 0), load tiếp trang cũ
    if (scrollTop <= 1 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  // ================= GỬI TIN =================
  const sendMessage = () => {
    if (!input.trim() || !otherUser) return;

    const messageContent = input.trim();
    const messageTime = new Date().toISOString();

    // Thêm message tạm thời để UX tốt (hiển thị ngay)
    const tempMsg = {
      id: `temp-${Date.now()}`,
      from: { id: currentUserId },
      to: { id: otherUser.id },
      content: messageContent,
      createdAt: messageTime,
      isSeen: false,
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Gửi lên socket - socket sẽ broadcast lại, ta sẽ check duplicate
    chatSocket.sendMessage(messageContent, otherUser.id);

    setInput("");
    fetchConversations(); // Cập nhật lại list ở ngoài
  };

  // ================= UI =================
  if (loading) return <div className="chat-box loading">Loading chats...</div>;

  // TRẠNG THÁI HIỂN THỊ DANH SÁCH CONVERSATIONS
  if (!otherUser) {
    return (
      <div className="chat-box">
        <div className="chat-box__header">
          <span className="chat-box__title">Hộp thư tin nhắn</span>
          <button className="chat-box__close" onClick={onClose || (() => {})}>
            ✕
          </button>
        </div>

        <div className="chat-box__rooms">
          {conversations.length === 0 && (
            <div className="chat-box__empty">Chưa có hội thoại nào</div>
          )}
          {conversations.map((conv) => {
            const user = {
              id: conv.otherUserId,
              email: conv.otherUserEmail,
              fullName: conv.otherUserEmail,
              avatar: null,
            };

            const isOnline = onlineUsers[user.id];

            return (
              <div
                key={conv.roomId}
                className="chat-box__room"
                onClick={() => handleSelectUser(user)}
              >
                <div className="chat-box__avatar-wrapper">
                  <img
                    src={
                      user.avatar || "https://i.pravatar.cc/150?u=" + user.id
                    }
                    alt="avatar"
                    className="chat-box__avatar"
                  />
                  <span
                    className={`chat-box__online-indicator ${isOnline ? "online" : "offline"}`}
                  ></span>
                </div>

                <div className="chat-box__room-info">
                  <div className="chat-box__room-name">
                    {user.fullName || user.email || "Khách hàng"}
                  </div>
                  <div
                    className={`chat-box__room-lastmsg ${conv.unreadCount > 0 ? "unread" : ""}`}
                  >
                    {conv.lastMessage
                      ? String(conv.lastMessageFrom) === String(currentUserId)
                        ? `Bạn: ${conv.lastMessage}`
                        : conv.lastMessage
                      : "Chưa có tin nhắn"}
                  </div>
                </div>

                {conv.unreadCount > 0 && (
                  <div className="chat-box__unread-badge">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TRẠNG THÁI CHAT VỚI 1 NGƯỜI CỤ THỂ
  const isOtherUserOnline = onlineUsers[otherUser.id];
  const lastSeenText = isOtherUserOnline
    ? "Đang hoạt động"
    : otherUser.lastSeen
      ? `Hoạt động ${formatTime(otherUser.lastSeen)}`
      : "Không trực tuyến";

  return (
    <div className="chat-box">
      <div className="chat-box__header chat-box__header--detail">
        <button className="chat-box__back" onClick={() => setOtherUser(null)}>
          ←
        </button>

        <div className="chat-box__user-profile">
          <div className="chat-box__avatar-wrapper chat-box__avatar-wrapper--small">
            <img
              src={
                otherUser.avatar ||
                "https://i.pravatar.cc/150?u=" + otherUser.id
              }
              alt="avatar"
              className="chat-box__avatar"
            />
            {isOtherUserOnline && (
              <span className="chat-box__online-dot"></span>
            )}
          </div>
          <div className="chat-box__user-info">
            <span className="chat-box__title">
              {otherUser.fullName || otherUser.email || "Khách hàng"}
            </span>
            <span className="chat-box__status">{lastSeenText}</span>
          </div>
        </div>

        <button className="chat-box__close" onClick={onClose || (() => {})}>
          ✕
        </button>
      </div>

      <div
        className="chat-box__messages"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              fontSize: "12px",
              color: "#999",
            }}
          >
            Đang tải tin nhắn cũ...
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine =
            String(msg.from?.id || msg.from) === String(currentUserId);

          return (
            <div
              key={msg.id || i}
              className={`chat-box__row ${isMine ? "chat-box__row--mine" : "chat-box__row--other"}`}
            >
              {!isMine && (
                <img
                  src={
                    otherUser.avatar ||
                    "https://i.pravatar.cc/150?u=" + otherUser.id
                  }
                  alt="avatar"
                  className="chat-box__msg-avatar"
                  style={{
                    minWidth: "30px",
                    minHeight: "30px",
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div className="chat-box__bubble-group">
                <div
                  className={`chat-box__bubble ${isMine ? "chat-box__bubble--mine" : "chat-box__bubble--other"}`}
                >
                  {msg.content}
                </div>
                <div className="chat-box__msg-time">
                  {formatTime(msg.createdAt)}
                  {isMine && (
                    <span className="chat-box__seen-status">
                      {msg.isSeen ? " • Đã xem" : " • Đã gửi"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-box__input">
        <textarea
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows="1"
          style={{ maxHeight: "90px", boxSizing: "border-box" }}
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

import { io } from "socket.io-client";
import { getAccessToken } from "@/utils/tokenService";
import env from "@/config/Config";

let socket = null;
let messageHandler = null;
let statusHandler = null;

export const chatSocket = {
  connect(onMessageReceived, onStatusChanged) {
    const token = getAccessToken();

    if (!token) {
      console.warn("Không có token");
      return;
    }

    messageHandler = onMessageReceived;
    statusHandler = onStatusChanged;

    if (socket && socket.connected) {
      console.log("Đã connect rồi");
      return;
    }

    socket = io(env.BE_URL, {
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Connect error:", err.message);
    });

    socket.on("user_online", (data) => {
      console.log("User online:", data);
      statusHandler?.({ type: "online", userId: data.userId });
    });

    socket.on("user_offline", (data) => {
      console.log("User offline:", data);
      statusHandler?.({ type: "offline", userId: data.userId });
    });

    socket.on("newMessage", (data) => {
      console.log("Nhận message:", data);
      messageHandler?.(data);
    });
  },
  joinRoom(otherUserId) {
    if (!socket || !socket.connected) {
      console.warn("Chưa connect");
      return;
    }

    console.log("Join chat với:", otherUserId);

    socket.emit("joinChat", { otherUserId });
  },

  sendMessage(content, to) {
    if (!socket || !socket.connected) {
      console.warn("Chưa connect");
      return;
    }

    socket.emit("newMessage", { content, to });
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    messageHandler = null;
    statusHandler = null;
  },

  isConnected() {
    return socket && socket.connected;
  },

  heartbeat(userId, chatWithId) {
    if (!socket || !socket.connected) {
      console.warn("Socket không connected, không gửi heartbeat");
      return;
    }
    console.log("Gửi heartbeat:", { userId, chatWithId });
    socket.emit("heartbeat", { userId, chatWithId });
  },
};

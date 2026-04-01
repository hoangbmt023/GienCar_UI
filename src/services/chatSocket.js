import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/utils/tokenService";

let client = null;

export const chatSocket = {

    connect(onMessageReceived) {

        // ❗ tránh connect nhiều lần
        if (client && client.connected) {
            console.log("⚠️ Socket đã connect rồi");
            return;
        }

        const token = getAccessToken();

        if (!token) {
            console.warn("❌ Không có token → không connect socket");
            return;
        }

        // 🔥 truyền token qua query (QUAN TRỌNG)
        const socket = new SockJS(
            `http://localhost:8080/ws?token=${token}`
        );

        client = new Client({
            webSocketFactory: () => socket,

            // ❗ vẫn giữ để dùng ở STOMP layer
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },

            debug: (str) => {
                console.log("STOMP:", str);
            },

            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected");

                client.subscribe("/topic/chat", (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        console.log("📩 Received:", data);

                        if (onMessageReceived) {
                            onMessageReceived(data);
                        }

                    } catch (error) {
                        console.error("Parse message error:", error);
                    }
                });
            },

            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame);
            },

            onWebSocketError: (error) => {
                console.error("❌ WebSocket error:", error);
            },

            onDisconnect: () => {
                console.log("🔌 WebSocket disconnected");
            }
        });

        // 🔥 QUAN TRỌNG: delay nhẹ để tránh race condition
        setTimeout(() => {
            client.activate();
        }, 100);
    },

    sendMessage(content) {
        if (!client || !client.connected) {
            console.warn("⚠️ Socket chưa connect");
            return;
        }

        const payload = {
            content: content
        };

        console.log("📤 Sending:", payload);

        client.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(payload)
        });
    },

    disconnect() {
        if (client) {
            client.deactivate();
            client = null;
            console.log("🔌 Socket disconnected");
        }
    },

    isConnected() {
        return client && client.connected;
    }
};
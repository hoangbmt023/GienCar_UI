import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

let client = null;
let currentRoomId = null;

export const connectSocket = (roomId, onMessageReceived) => {
    currentRoomId = roomId;

    const token = localStorage.getItem("accessToken");

    const socket = new SockJS(`http://localhost:8080/ws`);

    client = new Client({
        webSocketFactory: () => socket,

        connectHeaders: {
            Authorization: "Bearer " + token
        },

        onConnect: () => {
            console.log("Connected WebSocket");

            client.subscribe(`/topic/chat/${roomId}`, (msg) => {
                console.log("📩 Received:", msg.body);
                const data = JSON.parse(msg.body);
                onMessageReceived(data);
            });
        },

        onStompError: (frame) => {
            console.error("STOMP error:", frame);
        }
    });

    client.activate();
};

export const sendMessageSocket = (message) => {
    if (!client || !client.connected) {
        console.warn("Chưa connect socket");
        return;
    }

    console.log("📤 Sending:", message);

    client.publish({
        destination: "/app/chat.send",

        headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
        },

        body: JSON.stringify(message)
    });
};

export const disconnectSocket = () => {
    if (client) {
        client.deactivate();
        console.log("🔌 Disconnected");
    }
};
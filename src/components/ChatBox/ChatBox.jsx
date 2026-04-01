import { useEffect, useState } from "react";
import { chatSocket } from "../../services/chatSocket";
import { chatService } from "../../services/chatService";
import { jwtDecode } from "jwt-decode";
import "./ChatBox.scss";

export default function ChatBox({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentUserId, setCurrentUserId] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) return;

                const decoded = jwtDecode(token);
                const userId = decoded.sub;
                const role = decoded.role?.[0];

                setCurrentUserId(userId);
                setRole(role);

                if (role === "SALE") {
                    const res = await chatService.getChatRoomsForSale({
                        page: 1,
                        size: 20,
                        sortBy: "lastMessageAt",
                        sortDir: "desc"
                    });

                    setRooms(res.data.data || []);
                    setLoading(false);
                    return;
                }

                setLoading(false);

            } catch (err) {
                console.error("Init chat error:", err);
                setLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        chatSocket.connect((msg) => {
            setMessages((prev) => {
                if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        return () => chatSocket.disconnect();
    }, []);

    const handleSelectRoom = async (room) => {
        setRoomId(room.id);

        const resMsg = await chatService.getMessages(room.id, {
            page: 1,
            size: 50,
            sortBy: "createdAt",
            sortDir: "asc"
        });

        setMessages(resMsg.data.data || []);
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        chatSocket.sendMessage(input);
        setInput("");
    };

    if (loading) {
        return (
            <div className="chat-box">
                <div className="chat-box__loading">Đang tải chat...</div>
            </div>
        );
    }

    if (role === "SALE" && !roomId) {
        return (
            <div className="chat-box">
                <div className="chat-box__header">
                    <span>Danh sách chat</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="chat-box__rooms">
                    {rooms.length === 0 ? (
                        <div>Chưa có cuộc trò chuyện nào</div>
                    ) : (
                        rooms.map((room) => (
                            <div
                                key={room.id}
                                className="chat-box__room"
                                onClick={() => handleSelectRoom(room)}
                            >
                                👤 {room.userEmail}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="chat-box">

            {/* Header */}
            <div className="chat-box__header">
                <span>Tư vấn</span>
                <button onClick={onClose}>✕</button>
            </div>

            {/* Messages */}
            <div className="chat-box__messages">
                {messages.map((msg) => {
                    const isMine = String(msg.senderId) === String(currentUserId);

                    return (
                        <div
                            key={msg.id || `${msg.senderId}-${msg.content}-${Math.random()}`}
                            className={`chat-box__row ${isMine
                                ? "chat-box__row--mine"
                                : "chat-box__row--other"
                                }`}
                        >
                            <div
                                className={`chat-box__bubble ${isMine
                                    ? "chat-box__bubble--mine"
                                    : "chat-box__bubble--other"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="chat-box__input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage}>Gửi</button>
            </div>
        </div>
    );
}
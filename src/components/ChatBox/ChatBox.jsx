import { useEffect, useState } from "react";
import { connectSocket, sendMessageSocket } from "../../services/chatSocket";
import { getChatRoom, getChatRooms } from "../../services/chatService";
import { jwtDecode } from "jwt-decode";
import { userService } from "../../services/userService";
import axios from "../../services/axiosClient";
import "./ChatBox.scss"; // ✅ import SCSS

export default function ChatBox({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [roomId, setRoomId] = useState(null);

    const [chatInfo, setChatInfo] = useState({
        userId: null,
        adminId: null
    });

    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const initChat = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) return;

                const decoded = jwtDecode(token);
                const currentUserId = decoded.sub;
                const role = decoded.role?.[0];

                if (role === "ADMIN") {
                    const rooms = await getChatRooms();
                    const validRooms = rooms.filter(r => r.userId.length > 20);

                    setRooms(validRooms);
                    setLoading(false);
                    return;
                }

                const res = await userService.getAdmin();
                const adminId = res.data.id;
                const userId = currentUserId;

                setChatInfo({ userId, adminId });

                const room = await getChatRoom(userId, adminId);

                setRoomId(room.id);

                const resMsg = await axios.get(`/chat/${room.id}`);
                setMessages(resMsg.data);

                connectSocket(room.id, (msg) => {
                    setMessages(prev => {
                        if (prev.some(m => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                });

                setLoading(false);

            } catch (err) {
                console.error("Init chat error:", err);
                setLoading(false);
            }
        };

        initChat();
    }, []);

    const handleSelectRoom = async (room) => {
        setChatInfo({
            userId: room.userId,
            adminId: room.adminId
        });

        setRoomId(room.roomId);

        const resMsg = await axios.get(`/chat/${room.roomId}`);
        setMessages(resMsg.data);

        connectSocket(room.roomId, (msg) => {
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });
    };

    const sendMessage = () => {
        if (!input.trim() || !roomId) return;

        const msg = {
            userId: chatInfo.userId,
            adminId: chatInfo.adminId,
            content: input
        };

        sendMessageSocket(msg);
        setInput("");
    };

    if (loading) {
        return (
            <div className="chat-box">
                <div className="chat-box__loading">Đang tải chat...</div>
            </div>
        );
    }

    if (rooms.length > 0 && !roomId) {
        return (
            <div className="chat-box">
                <div className="chat-box__header">
                    <span>Danh sách chat</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="chat-box__rooms">
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="chat-box__room"
                            onClick={() => handleSelectRoom(room)}
                        >
                            👤 {room.userEmail}
                        </div>
                    ))}
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
                    const currentUserId = chatInfo.userId || chatInfo.adminId;
                    const isMine = msg.senderId === currentUserId;

                    return (
                        <div
                            key={msg.id || msg._id}
                            className={`chat-box__row ${isMine ? "chat-box__row--mine" : "chat-box__row--other"
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
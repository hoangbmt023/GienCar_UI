import { useState } from "react";
import ChatBox from "./ChatBox";
import FloatingAddButton from "./FloatingAddButton";
import "./ChatBoxContainer.scss";


export default function ChatBoxContainer() {
  const [selectedUserFromSales, setSelectedUserFromSales] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedUserFromSales(null);
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleSelectSales = (sale) => {
    setSelectedUserFromSales(sale);
  };

  return (
    <div className="chat-box-container">
      {/* ChatBox chỉ hiện khi showChat = true hoặc có selectedUser từ Sales */}
      {(showChat || selectedUserFromSales) && (
        <ChatBox
          selectedUser={selectedUserFromSales}
          onClose={handleCloseChat}
        />
      )}

      {/* FloatingAddButton - Ẩn khi ChatBox mở, Hiện khi ChatBox đóng */}
      {!showChat && !selectedUserFromSales && (
        <FloatingAddButton
          onSelectUser={handleSelectSales}
          onOpenChat={handleOpenChat}
        />
      )}
    </div>
  );
}

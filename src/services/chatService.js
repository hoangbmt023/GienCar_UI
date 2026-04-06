import axiosClient from "./axiosClient";

export const chatService = {

    // gửi tin nhắn (REST fallback)
    sendMessage(data) {
        return axiosClient.post("/chat/messages", data);
    },

    // lấy message theo chatroom
    getMessages(chatRoomId, params) {
        return axiosClient.get(`/chat/messages/${chatRoomId}`, { params });
    },

    // lấy list chat của SALE
    getChatRoomsForSale(params) {
        return axiosClient.get(`/chat/chatrooms/sale`, { params });
    }

};
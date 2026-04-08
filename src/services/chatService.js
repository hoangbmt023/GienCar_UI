import axiosClient from "./axiosClient";

export const chatService = {
  // lấy message theo chatroom (có phân trang)
  getMessages(otherUserId, page = 1, limit = 20) {
    return axiosClient.get(`/messages/me/messages/${otherUserId}`, {
      params: { page, limit },
    });
  },

  // lấy list danh sách đã nhắn tin
  getMyConversations() {
    return axiosClient.get(`/messages/me/conversations`);
  },
};

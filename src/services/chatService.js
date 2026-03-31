import axios from "./axiosClient";

export const getChatRoom = async (userId, adminId) => {
    const res = await axios.get("/chat/room", {
        params: { userId, adminId }
    });
    return res.data;
};

export const getChatRooms = async () => {
    const res = await axios.get("/chat/rooms");
    return res.data;
};
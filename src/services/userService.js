import axiosClient from "./axiosClient";

export const userService = {

    getAdmin() {
        return axiosClient.get("/users/admin");
    },

    // lấy profile của user hiện tại
    getMyProfile() {
        return axiosClient.get("/users/me/profile");
    },

    // cập nhật profile (multipart/form-data)
    updateMyProfile(data) {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        return axiosClient.put("/users/me/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    // ================= ADDRESS =================

    // thêm địa chỉ
    addAddress(data) {
        return axiosClient.post("/users/me/addresses", data);
    },

    // cập nhật địa chỉ
    updateAddress(addressId, data) {
        return axiosClient.put(`/users/me/addresses/${addressId}`, data);
    },

    // xóa địa chỉ
    removeAddress(addressId) {
        return axiosClient.delete(`/users/me/addresses/${addressId}`);
    },

    // Lấy thời gian hoạt động cuối cùng của một user
    getLastSeenUser(userId){
        return axiosClient.get(`/users/${userId}/last-seen`);
    },
    
    getListSales(){
        return axiosClient.get("/users/sales")
    }
};
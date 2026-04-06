import axiosClient from "@/services/axiosClient";
import publicRequest from "@/services/publicRequest";

export const bookingService = {

    // ================= PUBLIC =================

    // Khách đăng ký lái thử
    create(data) {
        return publicRequest.post("/bookings", data);
    },

    // Lấy danh sách time slot active
    getActiveTimeSlots() {
        return publicRequest.get("/booking-time-slots/active");
    },


    // ================= SALE / ADMIN =================

    // Lấy danh sách booking (có filter + paging)
    getAll(params) {
        return axiosClient.get("/bookings/manage", { params });
    },

    // Chi tiết booking
    getById(id) {
        return axiosClient.get(`/bookings/manage/${id}`);
    },

    // Xác nhận booking
    confirm(id, data) {
        return axiosClient.patch(`/bookings/manage/${id}/confirm`, data);
    },

    // Hủy booking (SALE)
    cancel(id, data) {
        return axiosClient.patch(`/bookings/manage/${id}/cancel`, data);
    },


    // ================= TIME SLOT (ADMIN) =================

    timeSlots: {
        // Lấy tất cả (có filter + paging)
        getAll(params) {
            return axiosClient.get("/booking-time-slots", { params });
        },

        // Tạo mới
        create(data) {
            return axiosClient.post("/booking-time-slots", data);
        },

        // Cập nhật
        update(id, data) {
            return axiosClient.put(`/booking-time-slots/${id}`, data);
        },

        // Xóa
        delete(id) {
            return axiosClient.delete(`/booking-time-slots/${id}`);
        },
    }
};
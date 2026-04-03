import axiosClient from "@/services/axiosClient";
import publicRequest from "@/services/publicRequest";

export const orderService = {

    branches: {
        // PUBLIC: lấy danh sách active
        getAll(params) {
            return publicRequest.get("/branches", { params });
        },
    },

    // USER: tạo đơn
    create(data) {
        return axiosClient.post("/orders", data);
    },

    // USER: danh sách đơn của tôi
    getMyOrders(params) {
        return axiosClient.get("/orders/my-orders", { params });
    },

    // USER: chi tiết đơn của tôi
    getById(id) {
        return axiosClient.get(`/orders/${id}`);
    },

    // SALE: danh sách tất cả đơn
    getAll(params) {
        return axiosClient.get("/orders/sale", { params });
    },

    // SALE: chi tiết đơn bất kỳ
    getByIdForSale(id) {
        return axiosClient.get(`/orders/sale/${id}`);
    },

    // USER: thanh toán
    pay(id) {
        return axiosClient.patch(`/orders/${id}/pay`);
    },

    // SALE: xác nhận đã nhận tiền
    confirmPaid(id) {
        return axiosClient.patch(`/orders/${id}/confirm-paid`);
    },

    // SALE: hoàn tất đơn
    confirm(id, data) {
        return axiosClient.patch(`/orders/${id}/confirm`, data);
    },

    // USER: hủy đơn
    cancel(id) {
        return axiosClient.patch(`/orders/${id}/cancel`);
    },

    // VNPay: tạo link thanh toán
    createVnpay(id) {
        return axiosClient.post(`/orders/${id}/vnpay-payment`);
    },

    // CALLBACK (public)
    vnpayCallback(params) {
        return publicRequest.get("/orders/vnpay-callback", { params });
    }
};
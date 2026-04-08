import publicRequest from "./publicRequest";
import axios from "axios";
import {
    getRefreshToken,
    clearTokens,
    saveTokens
} from "@/utils/tokenService";

export const authService = {

    // ================= LOGIN =================
    login(data) {
        return publicRequest.post("/auth/login", data)
            .then((res) => {
                const { accessToken, refreshToken } = res.data.data;
                // lưu token
                saveTokens(accessToken, refreshToken);

                return res;
            });
    },

    // ================= REGISTER =================
    register(data) {
        return publicRequest.post("/users/register", data);
    },

    // interceptor đã xử lý
    refreshToken(data) {
        return publicRequest.post("/auth/refresh-token", data);
    },

    // ================= LOGOUT =================
    logout() {
        const refreshToken = getRefreshToken();

        return axios.post(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
            { refreshToken }
        ).catch(() => {
            // ignore lỗi backend
        }).finally(() => {
            clearTokens();
        });
    },

    // ================= FORGOT PASSWORD =================
    forgotPassword(data) {
        return publicRequest.post("/auth/forgot-password", data);
    },

    verifyForgotPassword(data) {
        return publicRequest.post("/auth/verify-forgot-password", data);
    },

    resetPassword(data) {
        return publicRequest.post("/auth/reset-password", data);
    },

    // ================= ACTIVATE =================
    sendActivateOtp(data) {
        return publicRequest.post("/auth/send-activate-otp", data);
    },

    activateAccount(data) {
        return publicRequest.post("/auth/activate-account", data);
    }

};
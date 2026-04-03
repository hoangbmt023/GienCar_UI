import publicRequest from "./publicRequest";
import axiosClient from "./axiosClient";
import { getRefreshToken, clearTokens } from "@/utils/tokenService";

export const authService = {

    // login
    login(data) {
        return publicRequest.post("/auth/login", data);
    },

    // register
    register(data) {
        return publicRequest.post("/users/register", data);
    },

    // refresh token
    refreshToken(data) {
        return publicRequest.post("/auth/refresh-token", data);
    },

    // logout
    logout() {
        const refreshToken = getRefreshToken();

        return axios.post(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
            { refreshToken }
        ).catch(() => {
            // ignore lỗi
        }).finally(() => {
            clearTokens();
        });
    },

    // forgot password
    forgotPassword(data) {
        return publicRequest.post("/auth/forgot-password", data);
    },

    // verify OTP
    verifyForgotPassword(data) {
        return publicRequest.post("/auth/verify-forgot-password", data);
    },

    // reset password
    resetPassword(data) {
        return publicRequest.post("/auth/reset-password", data);
    },

    // send activate otp
    sendActivateOtp(data) {
        return publicRequest.post("/auth/send-activate-otp", data);
    },

    // activate account
    activateAccount(data) {
        return publicRequest.post("/auth/activate-account", data);
    }

};
import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens
} from "../utils/tokenService";

// instance chính
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// instance riêng để refresh (tránh loop interceptor)
const publicRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config;

        // Cho lỗi 429 đi thẳng
        if (error.response?.status === 429) {
            return Promise.reject(error);
        }

        // ================= 401 =================
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                // Không có refresh token → logout
                if (!refreshToken) {
                    clearTokens();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Gọi refresh API
                const res = await publicRequest.post("/auth/refresh-token", {
                    refreshToken
                });

                // FIX QUAN TRỌNG: đúng cấu trúc backend
                const { accessToken, refreshToken: newRefreshToken } = res.data.data;

                // Lưu lại token
                saveTokens(
                    accessToken,
                    newRefreshToken || refreshToken // backend bạn không trả refreshToken mới
                );

                // Gắn token mới
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Gọi lại request cũ
                return axiosClient(originalRequest);

            } catch (err) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
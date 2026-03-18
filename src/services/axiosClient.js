import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../utils/tokenService";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor request để thêm Authorization header
axiosClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor response để xử lý các lỗi như 401 và refresh token
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Cho lỗi 429 đi thẳng về component
        if (error.response?.status === 429) {
            return Promise.reject(error);
        }

        // Nếu lỗi 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                const newAccess = res.data.accessToken;
                saveTokens(newAccess, refreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return axiosClient(originalRequest);

            } catch (err) {
                // Xóa token và chuyển hướng về trang đăng nhập khi không thể refresh token
                clearTokens();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
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
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

            originalRequest._retry = true;

            try {

                const refreshToken = getRefreshToken();

                // nếu không có refresh token thì logout luôn
                if (!refreshToken) {
                    clearTokens();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                // hỗ trợ refresh token rotation
                const { accessToken, refreshToken: newRefreshToken } = res.data;

                saveTokens(accessToken, newRefreshToken || refreshToken);

                // gắn access token mới vào request cũ
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return axiosClient(originalRequest);

            } catch (err) {

                // refresh token cũng hết hạn → logout
                clearTokens();
                window.location.href = "/login";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
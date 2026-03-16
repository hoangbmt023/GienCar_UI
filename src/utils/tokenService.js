export const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return null;  // Nếu không có token, trả về null
    }
    // Thêm logic kiểm tra xem token có hợp lệ không (nếu cần, ví dụ token có hết hạn hay không)
    return token;
};

export const getRefreshToken = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        return null;  // Nếu không có refresh token, trả về null
    }
    return refreshToken;
};

export const saveTokens = (access, refresh) => {
    if (access && refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
    }
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
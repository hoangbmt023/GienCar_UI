import { jwtDecode } from "jwt-decode";

// ===== GET TOKEN =====
export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// ===== SAVE / CLEAR =====
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

// ===== DECODE TOKEN =====
export const decodeToken = () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.log("Decode token failed");
        return null;
    }
};

// ===== GET USER INFO (FIX Ở ĐÂY) =====

// ❌ BỎ function cũ getUserIdFromToken

// ✅ THÊM function mới
export const getUserFromToken = () => {
    const decoded = decodeToken();
    return decoded?.email; // hoặc decoded?.sub nếu muốn id
};

export const getRoleFromToken = () => {
    const decoded = decodeToken();
    return decoded?.role?.[0]; // vì role là array ["ADMIN"]
};

// ===== CHECK EXPIRED =====
export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return true;

        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch (e) {
        return true;
    }
};
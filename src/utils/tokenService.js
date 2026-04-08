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
  // luôn lưu access token nếu có
  if (access) {
    localStorage.setItem("accessToken", access);
  }

  // chỉ lưu refresh token nếu có (tránh bị null ghi đè)
  if (refresh) {
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

// ===== GET USER INFO =====
export const getUserFromToken = () => {
  const decoded = decodeToken();
  return decoded?.email || null; // hoặc decoded?.sub nếu backend dùng sub
};

export const getRoleFromToken = () => {
  const decoded = decodeToken();
  return decoded?.role?.[0] || null; // vì role là array ["ADMIN"]
};

// ===== CHECK EXPIRED =====
export const isTokenExpired = (token) => {
  try {
    if (!token) return true;

    const decoded = jwtDecode(token);

    const exp = decoded?.exp;
    if (!exp) return true;

    const now = Date.now() / 1000;
    return !!(exp < now);
  } catch (e) {
    return true;
  }
};

// ===== OPTIONAL: CHECK LOGIN =====
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!(token && !isTokenExpired(token));
};

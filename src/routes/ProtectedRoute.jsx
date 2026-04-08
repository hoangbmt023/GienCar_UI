import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
    getAccessToken,
    clearTokens,
    isTokenExpired,
    getRoleFromToken
} from "../utils/tokenService";

const ProtectedRoute = ({ allowedRoles }) => {

    const navigate = useNavigate();
    const token = getAccessToken();

    useEffect(() => {

        // ❌ Không có token
        if (!token) {
            navigate("/login", {
                state: { message: "Vui lòng đăng nhập để tiếp tục" }
            });
            return;
        }

        // ❌ Token hết hạn
        if (isTokenExpired(token)) {
            clearTokens();
            navigate("/login", {
                state: { message: "Phiên đăng nhập đã hết hạn" }
            });
            return;
        }

        // ❌ Sai role
        if (allowedRoles && allowedRoles.length > 0) {
            const userRole = getRoleFromToken();

            if (!allowedRoles.includes(userRole)) {
                const previousPath = sessionStorage.getItem("previousPath");

                navigate(previousPath || "/home", {
                    state: { message: "Bạn không có quyền truy cập" }
                });
            }
        }

    }, [token, allowedRoles]);

    // 🔥 QUAN TRỌNG NHẤT
    return <Outlet />;
};

export default ProtectedRoute;
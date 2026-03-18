import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { clearTokens } from "../../../utils/tokenService";
import "./LogoutButton.scss";

const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            await authService.logout();

        } catch (error) {

            console.log("Logout API lỗi nhưng vẫn logout local");

        } finally {

            clearTokens();

            navigate("/login");

        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
        </button>
    );
};

export default LogoutButton;
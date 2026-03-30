import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AvatarHeader.scss";

// 🔥 import service + token
import { authService } from "@/services/authService";
import {
    getRoleFromToken,
    getUserFromToken,
} from "@/utils/tokenService";

export default function AvatarHeader() {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();

    const user = getUserFromToken();
    const role = getRoleFromToken();

    if (!user) return null;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setOpen(false);
            navigate("/login");
        }
    };

    return (
        <div className="avatar-header" ref={ref}>
            {/* AVATAR */}
            <div
                className="avatar-img"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
            >
                <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                />
            </div>

            {/* DROPDOWN */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="avatar-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* USER INFO */}
                        <div className="dropdown-item">
                            {user?.split("@")[0]}
                        </div>

                        <div
                            className="dropdown-item"
                            onClick={() => navigate("/profile")}
                        >
                            Cài đặt
                        </div>

                        {/* ADMIN */}
                        {role === "ADMIN" && (
                            <div
                                className="dropdown-item"
                                onClick={() =>
                                    navigate("/admin/menu-car")
                                }
                            >
                                Trang admin
                            </div>
                        )}

                        <div className="dropdown-divider"></div>

                        {/* LOGOUT */}
                        <div
                            className="dropdown-item logout"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
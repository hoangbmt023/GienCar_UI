import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AvatarHeader.scss";

export default function AvatarHeader() {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    // click outside để đóng menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
                        <div className="dropdown-item">
                            👤 Thông tin tài khoản
                        </div>

                        <div className="dropdown-item">
                            ⚙️ Cài đặt
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="dropdown-item logout">
                            🚪 Đăng xuất
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { menuService } from "@/services/menuService";
import "./Header.scss";
import env from "../../config/Config";

export default function Header() {

    const [activeMenu, setActiveMenu] = useState(null);
    const [activeItem, setActiveItem] = useState(0);
    const [menus, setMenus] = useState([]);

    // 🔥 Transform từ DTO backend → UI
    const BASE_URL = env.FE_URL; // 🔥 đổi thành domain thật của bạn

    const transformMenu = (data) => {
        if (!Array.isArray(data)) return [];

        return data.map(menu => ({
            id: menu.id,
            label: menu.name,
            slug: menu.slug,
            image: "/default.jpg",

            children: menu.children?.map(child => ({
                id: child.id,
                label: child.name,
                slug: child.slug,

                // 🔥 gắn domain nếu là relative path
                url: child.url
                    ? child.url.startsWith("http")
                        ? child.url
                        : `${BASE_URL}${child.url}`
                    : "#",

                target: child.target?.[0] || "_self", // 🔥 lấy target

                children: child.children || []
            })) || []
        }));
    };

    // 🔥 Call API
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await menuService.getMenus({
                    type: "HEADER",
                    locale: "EN" // 🔥 thêm dòng này
                });

                const rawData = res.data.data;

                setMenus(transformMenu(rawData));

            } catch (error) {
                console.error("Load menu lỗi:", error);
            }
        };

        fetchMenus();
    }, []);

    const menu = menus?.[activeMenu];

    // tránh lỗi render lần đầu
    if (!menus.length) return null;

    return (
        <header className={`header ${activeMenu !== null ? "header-open" : ""}`}>

            {/* TOP NAV */}
            <div className="header-nav">
                {menus.map((menu, i) => (
                    <div
                        key={menu.id || i}
                        onMouseEnter={() => {
                            setActiveMenu(i);
                            setActiveItem(0);
                        }}
                        className="nav-item"
                    >
                        {menu.label}
                    </div>
                ))}
            </div>

            {/* MEGA MENU */}
            {menu && (
                <div
                    className="mega-menu"
                    onMouseLeave={() => setActiveMenu(null)}
                >

                    {/* PANEL 1 */}
                    <motion.div
                        initial={{ x: -160 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="panel-1"
                    />

                    {/* PANEL 2 */}
                    <motion.div
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.45 }}
                        className="panel-2"
                    >

                        {menu.children?.map((item, index) => {

                            const isClickable = !item.children || item.children.length === 0;
                            const isExternal = item.target === "_blank";

                            if (isClickable) {
                                if (isExternal) {
                                    return (
                                        <a
                                            key={index}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="panel2-item"
                                        >
                                            {item.label}
                                        </a>
                                    );
                                }

                                return (
                                    <NavLink
                                        key={index}
                                        to={item.url}
                                        className="panel2-item"
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            }

                            return (
                                <motion.div
                                    key={index}
                                    onMouseEnter={() => setActiveItem(index)}
                                    className={`panel2-item ${activeItem === index ? "active" : ""}`}
                                >
                                    {item.label}
                                </motion.div>
                            );
                        })}

                    </motion.div>

                    {/* PANEL 3 */}
                    <motion.div
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.45, delay: 0.25 }}
                        className="panel-3"
                    >

                        <motion.div
                            key={activeItem}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.35, delay: 0.55 }}
                            className="panel3-list"
                        >

                            {menu.children?.[activeItem]?.children?.length > 0 &&
                                menu.children[activeItem].children.map((sub, i) => {

                                    const isExternal = sub.target === "_blank";

                                    // 🔥 Nếu là external → dùng <a>
                                    if (isExternal) {
                                        return (
                                            <a
                                                key={i}
                                                href={sub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="panel3-item"
                                            >
                                                {sub.name}
                                            </a>
                                        );
                                    }

                                    // 🔥 Nếu internal → dùng NavLink
                                    return (
                                        <NavLink
                                            key={i}
                                            to={sub.url}
                                            className="panel3-item"
                                        >
                                            {sub.name}
                                        </NavLink>
                                    );
                                })}

                        </motion.div>

                    </motion.div>

                    {/* IMAGE */}
                    <div
                        className="panel-fill"
                        onMouseEnter={() => setActiveMenu(null)}
                        style={{
                            backgroundImage: `url(${menu.image})`,
                        }}
                    />

                </div>
            )}
        </header>
    );
}
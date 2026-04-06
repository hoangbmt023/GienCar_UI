import "./Sidebar.scss";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken, getRoleFromToken, clearTokens } from "@/utils/tokenService";
import logo from "@/assets/logo/backgroundgiencar.jpg";
import {
    LayoutDashboard,
    Settings,
    Home,
    LogOut,
    ChevronDown,
    Car,
    Building2,
    Users,
} from "lucide-react";

const menus = [
    {
        id: "menu",
        label: "Quản lý menu",
        icon: LayoutDashboard,
        children: [
            { label: "Menu home", to: "/admin/menu-home" },
            { label: "Menu header/footer", to: "/admin/Menu-Header-Footer" },
        ],
    },
    {
        id: "car",
        label: "Quản lý xe",
        icon: Car,
        children: [
            { label: "Danh mục xe", to: "/admin/danh-muc-xe" },
            { label: "Thương hiệu xe", to: "/admin/thuong-hieu-xe" },
            { label: "Hãng xe", to: "/admin/hang-xe" },
            { label: "Xe", to: "/admin/xe" },
            { label: "Thông số kỹ thuật", to: "/admin/thong-so-ky-thuat" },
            { label: "Quản lý màu", to: "/admin/list-mau-xe" },
            { label: "Quản lý màu xe", to: "/admin/mau-xe" },
        ],
    },
    {
        id: "spec",
        label: "Chi nhánh",
        icon: Building2,
        children: [
            { label: "Quản lý chi nhánh", to: "/admin/chi-nhanh" },
        ],
    },
    {
        id: "user",
        label: "Người dùng",
        icon: Users,
        children: [
            { label: "Quản lý người dùng", to: "/admin/nguoi-dung" },
            { label: "Quản lý khung giờ đặt lịch", to: "/admin/lich-lai-thu" },
        ],
    },
];

export default function Sidebar({ collapsed, onlogins, onClose }) {

    // ===== USER INFO =====
    const rawUser = getUserFromToken();
    const role = getRoleFromToken();

    const userName = rawUser ? rawUser.split("@")[0] : "User";

    const navigate = useNavigate();
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState(() => {
        const found = menus.find((m) =>
            m.children.some((c) =>
                location.pathname.startsWith(c.to)
            )
        );
        return found?.id || null;
    });

    /* ===== HANDLER ===== */
    const toggleMenu = (id) => {
        if (collapsed) return;
        setOpenMenu(openMenu === id ? null : id);
    };

    const handleLogout = () => {
        clearTokens();
        onlogins?.(false);
        navigate("/login");
    };

    const isMenuActive = (children) => {
        return children.some((c) =>
            location.pathname.startsWith(c.to)
        );
    };

    return (
        <aside className={`Sidebar ${collapsed ? "collapsed" : ""}`}>

            {/* ===== HEADER ===== */}
            <div className="Sidebar__top">
                <div
                    className="Sidebar__logo"
                    onClick={() => navigate("/home")}
                >
                    <img src={logo} alt="GienCar" />
                </div>
            </div>

            {/* ===== MENU ===== */}
            <nav className="Sidebar__nav">
                {menus.map((m) => {
                    const Icon = m.icon;
                    const active = isMenuActive(m.children);

                    return (
                        <div key={m.id}>
                            {/* MENU CHA */}
                            <div
                                className={`Sidebar__item ${active ? "Sidebar__item--active" : ""}`}
                                onClick={() => toggleMenu(m.id)}
                            >
                                <span className="Sidebar__icon">
                                    <Icon size={18} />
                                </span>

                                {!collapsed && (
                                    <>
                                        <span className="Sidebar__label">
                                            {m.label}
                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className={`Sidebar__arrow ${openMenu === m.id ? "open" : ""}`}
                                        />
                                    </>
                                )}
                            </div>

                            {/* SUBMENU */}
                            {!collapsed && (
                                <div
                                    className={`Sidebar__submenu ${openMenu === m.id ? "show" : ""}`}
                                >
                                    {m.children.map((sub, i) => (
                                        <NavLink
                                            key={i}
                                            to={sub.to}
                                            onClick={() => onClose?.()}
                                            className={({ isActive }) =>
                                                `Sidebar__subitem ${isActive ? "active" : ""}`
                                            }
                                        >
                                            {sub.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* ===== USER INFO ===== */}
            <div className="Sidebar__user">
                <div className="Sidebar__avatar">
                    {userName?.charAt(0)?.toUpperCase()}
                </div>

                {!collapsed && (
                    <div className="Sidebar__userInfo">
                        <div className="Sidebar__userName">{userName}</div>
                        <div className="Sidebar__userRole">{role || "USER"}</div>
                    </div>
                )}
            </div>

            {/* ===== FOOTER ===== */}
            <div className="Sidebar__footer">
                <button
                    className="Sidebar__item"
                    onClick={() => navigate("/home")}
                >
                    <span className="Sidebar__icon">
                        <Home size={18} />
                    </span>
                    {!collapsed && (
                        <span className="Sidebar__label">Trang chủ</span>
                    )}
                </button>

                <button
                    className="Sidebar__item Sidebar__danger"
                    onClick={handleLogout}
                >
                    <span className="Sidebar__icon">
                        <LogOut size={18} />
                    </span>
                    {!collapsed && (
                        <span className="Sidebar__label">Đăng xuất</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
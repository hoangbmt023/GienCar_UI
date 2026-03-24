import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { menuService } from "@/services/menuService";
import "./Header.scss";
import env from "../../config/Config";

export default function Header() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeItem, setActiveItem] = useState(0);
    const [menus, setMenus] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Logic mới cho Mobile: Lưu danh sách các menu đang mở để hỗ trợ đa cấp
    const [mobileActiveMenus, setMobileActiveMenus] = useState([]);
    
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const BASE_URL = env.FE_URL;

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) { 
                    setIsVisible(false);
                    setActiveMenu(null);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };
        window.addEventListener('scroll', controlHeader);
        return () => window.removeEventListener('scroll', controlHeader);
    }, [lastScrollY]);

    const transformChildren = (items) => {
        if (!items || !Array.isArray(items)) return [];
        return items.map(item => ({
            ...item,
            label: item.name,
            url: item.url ? (item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`) : "#",
            target: item.target?.[0] || "_self",
            children: item.children?.length ? transformChildren(item.children) : []
        }));
    };

    const transformMenu = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(menu => ({
            ...menu,
            label: menu.name,
            image: menu.image || "/default.jpg",
            children: menu.children?.length ? transformChildren(menu.children) : []
        }));
    };

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await menuService.getMenus({ type: "HEADER", locale: "EN" });
                setMenus(transformMenu(res.data.data));
            } catch (error) {
                console.error("Load menu lỗi:", error);
            }
        };
        fetchMenus();
    }, []);

    // Logic Mobile
    const toggleMobileSubmenu = (menuKey) => {
        setMobileActiveMenus(prev => 
            prev.includes(menuKey) 
                ? prev.filter(key => key !== menuKey) 
                : [...prev, menuKey]
        );
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) setMobileActiveMenus([]);
    };

    const renderMobileMenuItem = (item, level = 0, parentKey = "") => {
        const hasChildren = item.children && item.children.length > 0;
        const currentKey = parentKey ? `${parentKey}-${item.id}` : `${item.id}`;
        const isOpen = mobileActiveMenus.includes(currentKey);

        if (hasChildren) {
            return (
                <div className={`mobile-menu-item mobile-menu-level-${level}`}>
                    <div className="mobile-menu-header" onClick={() => toggleMobileSubmenu(currentKey)}>
                        <span className={level === 0 ? 'uppercase-text' : ''}>{item.label}</span>
                        <span className="mobile-menu-arrow">{isOpen ? '−' : '+'}</span>
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mobile-submenu"
                            >
                                {item.children.map((child, idx) => (
                                    <div key={child.id || idx} className="mobile-submenu-item">
                                        {renderMobileMenuItem(child, level + 1, currentKey)}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        const isExternal = item.target === "_blank";
        const linkClass = `mobile-menu-link mobile-menu-level-${level}`;
        
        return isExternal ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                {level === 0 ? item.label.toUpperCase() : item.label}
            </a>
        ) : (
            <NavLink to={item.url} className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                {level === 0 ? item.label.toUpperCase() : item.label}
            </NavLink>
        );
    };

    if (!menus.length) return null;
    const menu = menus?.[activeMenu];

    return (
        <>
            {/* Desktop Header - KHÔI PHỤC NGUYÊN VẸN HIỆU ỨNG CŨ */}
            <header className={`header desktop-header ${!isVisible ? "header--hidden" : ""} ${activeMenu !== null ? "header-open" : ""}`}>
                <div className="header-nav">
                    {menus.map((m, i) => (
                        <div key={m.id || i} onMouseEnter={() => { setActiveMenu(i); setActiveItem(0); }} className="nav-item">
                            {m.label.toUpperCase()}
                        </div>
                    ))}
                </div>

                {menu && (
                    <div className="mega-menu" onMouseLeave={() => setActiveMenu(null)}>
                        <motion.div initial={{ x: -160 }} animate={{ x: 0 }} transition={{ duration: 0.35 }} className="panel-1" />
                        <motion.div initial={{ x: -420 }} animate={{ x: 0 }} transition={{ duration: 0.45 }} className="panel-2">
                            {menu.children?.map((item, index) => {
                                const isClickable = !item.children || item.children.length === 0;
                                const isExternal = item.target === "_blank";
                                if (isClickable) {
                                    return isExternal ? (
                                        <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="panel2-item">{item.label}</a>
                                    ) : (
                                        <NavLink key={index} to={item.url} className="panel2-item">{item.label}</NavLink>
                                    );
                                }
                                return (
                                    <motion.div key={index} onMouseEnter={() => setActiveItem(index)} className={`panel2-item ${activeItem === index ? "active" : ""}`}>
                                        {item.label}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                        <motion.div initial={{ x: -420 }} animate={{ x: 0 }} transition={{ duration: 0.45, delay: 0.25 }} className="panel-3">
                            <motion.div key={activeItem} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, delay: 0.55 }} className="panel3-list">
                                {menu.children?.[activeItem]?.children?.map((sub, i) => (
                                    sub.target === "_blank" ? (
                                        <a key={i} href={sub.url} target="_blank" rel="noopener noreferrer" className="panel3-item">{sub.label}</a>
                                    ) : (
                                        <NavLink key={i} to={sub.url} className="panel3-item">{sub.label}</NavLink>
                                    )
                                ))}
                            </motion.div>
                        </motion.div>
                        <div className="panel-fill" style={{ backgroundImage: `url(${menu.image})` }} onMouseEnter={() => setActiveMenu(null)} />
                    </div>
                )}
            </header>

            {/* Mobile Header - GIỮ LOGIC ĐA CẤP MỚI */}
            <header className={`header mobile-header ${!isVisible ? "header--hidden" : ""}`}>
                <div className="mobile-header-container">
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                            <span></span><span></span><span></span>
                        </span>
                    </button>
                    <div className="mobile-logo"> {/* Logo here */} </div>
                </div>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="mobile-menu-overlay">
                            <div className="mobile-menu-content">
                                {menus.map((menuItem, idx) => (
                                    <div key={menuItem.id || idx} className="mobile-menu-section">
                                        {renderMobileMenuItem(menuItem, 0)}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}
import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { decodeToken, getUserIdFromToken } from "@/hooks/auth";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import adminRouteTitles from "./adminRouteTitles";


import "./AdminLayout.scss";
import useIsMobile from "../../../hooks/useIsMobile";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const location = useLocation();
    const isMobile = useIsMobile();

    const title = useMemo(() => {
        return adminRouteTitles[location.pathname] || "BẢNG THÔNG TIN";
    }, [location.pathname]);

    const decoded = decodeToken();
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) {
            setIsLogin(false);
            return;
        }
        setIsLogin(true);

    }, [userId]);

    const handleToggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    };

    return (
        <div
            className={`AdminLayout 
                ${sidebarOpen ? "sidebar-open" : ""} 
                ${collapsed ? "collapsed" : ""}`}
        >
            {/* ===== SIDEBAR ===== */}
            <Sidebar
                collapsed={collapsed}
                onClose={() => setSidebarOpen(false)}
                dataUser={dataUser}
            />

            {/* ===== OVERLAY (mobile) ===== */}
            {sidebarOpen && isMobile && (
                <div
                    className="SidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== MAIN ===== */}
            <div className="AdminLayout__main">
                <div className="BackgroundHeader" />

                {/* ===== NAVBAR ===== */}
                <div className="NavBar">

                    <div
                        className="SidebarToggle"
                        onClick={() => {
                            if (isMobile) {
                                setSidebarOpen(!sidebarOpen);
                            } else {
                                setCollapsed(!collapsed);
                            }
                        }}
                    >
                        {collapsed ? (
                            <ChevronRight size={18} color="#333" />
                        ) : (
                            <ChevronLeft size={18} color="#333" />
                        )}
                    </div>

                    {/* ===== TITLE ===== */}
                    <div className="NavBar__title NavBar__title--center">
                        {title}
                    </div>
                </div>

                {/* ===== CONTENT ===== */}
                <div className="AdminLayout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
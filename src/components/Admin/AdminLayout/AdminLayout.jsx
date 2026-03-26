import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { decodeToken, getUserIdFromToken } from "@/hooks/auth";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import adminRouteTitles from "./adminRouteTitles";
import * as authServices from "../../../services/Admin/AuthenticationService.jsx";

import "./AdminLayout.scss";
import useIsMobile from "../../../hooks/useIsMobile";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLayout() {
    const [q, setQ] = useState("");
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

        // const fetchApi = async () => {
        //     var result = await authServices.getUserById(userId);
        //     setDataUser(result.data);
        // };
        // fetchApi();
    }, [userId]);

    return (
        <div
            className={`AdminLayout 
                ${sidebarOpen ? "sidebar-open" : ""} 
                ${collapsed ? "collapsed" : ""}`}
        >
            <Sidebar
                collapsed={collapsed}
                onClose={() => setSidebarOpen(false)}
                dataUser={dataUser}
            />

            {sidebarOpen && (
                <div
                    className="SidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="AdminLayout__main">
                <div className="BackgroundHeader" />

                <div className="NavBar">

                    {!isMobile && (
                        <div
                            className="SidebarToggle"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <ChevronRight size={18} color="#333" />
                            ) : (
                                <ChevronLeft size={18} color="#333" />
                            )}
                        </div>
                    )}

                    <div className="NavBar__title NavBar__title--center">
                        {title}
                    </div>
                </div>

                <div className="AdminLayout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
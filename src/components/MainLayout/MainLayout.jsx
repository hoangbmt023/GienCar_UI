import Header from '@/components/Header/Header'
import { Outlet, useLocation, matchPath } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function MainLayout() {
    const location = useLocation();

    // ===== TOAST LISTENER =====
    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state.message);

            // 🔥 clear state tránh bị lặp lại khi reload/back
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // ===== UI LOGIC =====
    const isHome = location.pathname === "/home";
    const isCarDetail = matchPath("/models/:slug", location.pathname);

    const noPadding = isHome || isCarDetail;

    return (
        <>
            <Header />

            <div
                className="main-content"
                style={{
                    paddingTop: noPadding ? 0 : "40px"
                }}
            >
                <Outlet />
            </div>

            <Footer />
        </>
    )
}
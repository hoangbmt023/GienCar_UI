import Header from '@/components/Header/Header'
import { Outlet, useLocation, matchPath } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function MainLayout() {
    const location = useLocation();

    // route tĩnh
    const isHome = location.pathname === "/home";

    // route động: /cars/:id
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
import { useEffect, useState } from "react";

import "../components/Authenticator/Home.scss";
import HeroVideo from "../components/HeroVideo/HeroVideo";
import HeroContent from "../components/HeroContent/HeroContent";
import HeroGrid from "../components/HeroGrid/HeroGrid";
import SplashScreen from "../components/SplashScreen/SplashScreen";
// import LogoutButton from "../components/Commons/LogoutButton/LogoutButton";

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // thời gian splash (khớp animation)

        return () => clearTimeout(timer);
    }, []);

    // 👉 Nếu đang loading thì chỉ hiện logo
    if (loading) {
        return <SplashScreen />;
    }

    // 👉 Sau khi splash xong thì render Home
    return (
        <main className="home">
            <HeroVideo />

            {/* <LogoutButton /> */}

            <HeroContent />
            <HeroGrid />
        </main>
    );
}
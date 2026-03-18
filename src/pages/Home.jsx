import "../components/Authenticator/Home.scss";
import HeroVideo from "../components/HeroVideo/HeroVideo";
import HeroContent from "../components/HeroContent/HeroContent";
import HeroGrid from "../components/HeroGrid/HeroGrid";
import LogoutButton from "../components/Commons/LogoutButton/LogoutButton";

export default function Home() {
    return (
        <main className="home">
            {/* HERO VIDEO */}
            <HeroVideo />

            {/* // Nút dùng để test nút đăng xuất
            <LogoutButton /> */}

            {/* HERO CONTENT */}
            <HeroContent />
            {/* GRID CONTENT */}
            <HeroGrid />
        </main>
    )
}
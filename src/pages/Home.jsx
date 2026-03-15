import "../components/Authenticator/Home.scss";
import HeroVideo from "../components/HeroVideo/HeroVideo";
import HeroContent from "../components/HeroContent/HeroContent";
import HeroGrid from "../components/HeroGrid/HeroGrid";

export default function Home() {
    return (
        <main className="home">     
            {/* HERO VIDEO */}
            <HeroVideo />
            {/* HERO CONTENT */}
            <HeroContent />
            {/* GRID CONTENT */}
            <HeroGrid />
        </main>
    )
}
import "./SplashScreen.scss";
import logo from "@/assets/logo/logo_nobackground.png";

export default function SplashScreen() {
    return (
        <div className="splash">
            <img
                src={logo}
                alt="logo"
                className="splash-logo"
            />
        </div>
    );
}
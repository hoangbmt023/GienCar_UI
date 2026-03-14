import "./AuthLayout.scss";
import loginVideo from "../../assets/video/login-video.mp4";

function AuthLayout({ children }) {
    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-box">
                    {children}
                </div>
            </div>

            <div className="login-right">
                <video
                    src={loginVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="login-video"
                />
            </div>
        </div>
    );
}

export default AuthLayout;
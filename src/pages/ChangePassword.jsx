import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import logo from '@/assets/logo/backgroundgiencar.jpg'
import loginVideo from "../assets/video/login-video.mp4";
import React from "react";
import { Link } from "react-router-dom";
import "@/components/Authenticator/Login.scss"

const ChangePassword = () => {
    return (
        <div className="login-container">
            {/* LEFT SIDE */}
            <div className="login-left">
                <div className="login-box">
                    <h1 className="login-title">Change Password</h1>
                    <p className="subtitle">
                        That’s good! Now enter the new password you want to save.
                    </p>

                    <form>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Enter your new password"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm password</label>
                            <input
                                type="password"
                                placeholder="Enter your confirm password"
                                className="input-field"
                            />
                        </div>

                        <div className="options-row">
                            <label className="remember-me">
                                <input type="checkbox" />
                                Remember
                            </label>

                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="login-btn">
                            Confirm
                        </button>
                    </form>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="social-btn">
                        <img src={googleIcon} alt="google" />
                        Sign in with Google
                    </button>

                    <button className="social-btn">
                        <img src={appleIcon} alt="apple" />
                        Sign in with Apple
                    </button>

                    <p className="signup-text">
                        Don’t have an account?{" "}
                        <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
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
};

export default ChangePassword;
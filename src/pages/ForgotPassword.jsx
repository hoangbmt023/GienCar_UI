import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import logo from '@/assets/logo/backgroundgiencar.jpg'
import loginVideo from "../assets/video/login-video.mp4";
import React from "react";
import { Link } from "react-router-dom";
import "@/components/Authenticator/Login.scss"

const ForgotPassword = () => {
    return (
        <div className="login-container">
            {/* LEFT SIDE */}
            <div className="login-left">
                <div className="login-box">
                    <h1 className="login-title">Forgot Password</h1>
                    <p className="subtitle">
                        Don't worry! This happens often. Please enter your email address, and we will send the OTP code to it.
                    </p>

                    <form>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            Continue
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

export default ForgotPassword;
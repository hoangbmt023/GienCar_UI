import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import logo from '@/assets/logo/backgroundgiencar.jpg'
import loginVideo from "../assets/video/login-video.mp4";
import React from "react";
import { Link } from "react-router-dom";
import "@/components/Authenticator/Login.scss"

const Register = () => {
    return (
        <div className="login-container">
            {/* LEFT SIDE */}
            <div className="login-left">
                <div className="login-box">
                    <h1 className="login-title">Get Started Now</h1>

                    <form>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="options-row">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>
                                    I agree to the{" "}
                                    <Link to="/terms" className="policy-link">
                                        terms & policy
                                    </Link>
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="login-btn">
                            Sign Up
                        </button>

                        <p className="signup-text">
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </form>
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

export default Register;
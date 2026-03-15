import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import OptionsRow from "../components/OptionsRow/OptionsRow";
import SocialButton from "../components/Commons/SocialButton/SocialButton";

import { authService } from "@/services/authService";

import "@/components/Authenticator/Login.scss";

const ChangePassword = () => {

    const navigate = useNavigate();

    const email = localStorage.getItem("forgotEmail");
    const otp = localStorage.getItem("forgotOtp");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // kiểm tra user có đi đúng flow không
    useEffect(() => {

        const verified = localStorage.getItem("otpVerified");

        if (!email || !otp || !verified) {
            navigate("/forgotpassword", { replace: true });
        }

    }, [navigate, email, otp]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setErrorMessage("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            setErrorMessage("Vui lòng nhập đầy đủ mật khẩu");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        try {

            setLoading(true);

            await authService.resetPassword({
                email: email,
                otp: otp,
                newPassword: formData.password,
                logoutAllDevices: false
            });

            setSuccessMessage("Bạn đã đặt lại mật khẩu thành công");

        } catch (error) {

            console.error(error);

            const message = error.response?.data?.message;

            if (message === "Token expired") {
                setErrorMessage("Link không hợp lệ hoặc đã hết hạn");
            } else {
                setErrorMessage(message || "Đổi mật khẩu thất bại");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {successMessage && (
                <div className="success-overlay">
                    <div className="success-box">

                        <div className="success-icon">✓</div>

                        <h2>Password Reset Successful</h2>

                        <p>{successMessage}</p>

                        <button
                            className="login-btn"
                            onClick={() => {

                                localStorage.removeItem("forgotEmail");
                                localStorage.removeItem("forgotOtp");
                                localStorage.removeItem("otpVerified");

                                navigate("/login", { replace: true });

                            }}
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}

            <AuthLayout>

                <h1 className="login-title">Change Password</h1>

                <p className="subtitle">
                    That’s good! Now enter the new password you want to save.
                </p>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <InputField
                        label="New Password"
                        type="password"
                        name="password"
                        placeholder="Enter your new password"
                        onChange={handleChange}
                    />

                    <InputField
                        label="Confirm password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Enter your confirm password"
                        onChange={handleChange}
                    />

                    <OptionsRow>
                        <label className="remember-me">
                            <input type="checkbox" />
                            Remember
                        </label>

                        <Link to="/forgotpassword" className="forgot-link">
                            Forgot password?
                        </Link>
                    </OptionsRow>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Confirm"}
                    </button>

                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <SocialButton
                    icon={googleIcon}
                    text="Sign in with Google"
                />

                <SocialButton
                    icon={appleIcon}
                    text="Sign in with Apple"
                />

                <p className="signup-text">
                    Don’t have an account{" "}
                    <Link to="/register">Sign up</Link>
                </p>

            </AuthLayout>
        </>
    );
};

export default ChangePassword;
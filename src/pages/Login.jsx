import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import "@/components/Authenticator/Login.scss"

import AuthLayout from '../components/AuthLayout/AuthLayout';
import InputField from '../components/InputField/InputField';
import OptionsRow from '../components/OptionsRow/OptionsRow';
import SocialButton from '../components/Commons/SocialButton/SocialButton';

import { authService } from "@/services/authService";
import { saveTokens } from "@/utils/tokenService";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // xoá lỗi khi user nhập lại
        setErrorMessage("");
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await authService.login(formData);

            const { accessToken, refreshToken } = res.data.data;

            saveTokens(accessToken, refreshToken);

            navigate("/home");

        } catch (error) {

            console.error(error);

            const data = error.response?.data;

            // nếu tài khoản chưa kích hoạt
            if (data?.message === "Tài khoản chưa được kích hoạt") {

                const confirmActivate = window.confirm(
                    "Tài khoản chưa được kích hoạt.\nBạn có muốn xác minh tài khoản không?"
                );

                if (!confirmActivate) return;

                // lưu email cho OTP page
                localStorage.setItem("activateEmail", formData.email);

                // chuyển sang trang OTP
                navigate("/otpverify");

                return;
            }

            if (data?.errors) {
                setFieldErrors(data.errors);
            } else {
                setErrorMessage(data?.message || "Đăng nhập thất bại");
            }
        }
    };

    return (
        <AuthLayout>

            <h1 className="login-title">Sign In</h1>

            {/* hiển thị lỗi */}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    error={fieldErrors.email}
                />

                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    error={fieldErrors.password}
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

                <button type="submit" className="login-btn">
                    Sign In
                </button>

            </form>

            <div className="divider">
                <span>OR</span>
            </div>

            <SocialButton icon={googleIcon} text="Sign in with Google" />
            <SocialButton icon={appleIcon} text="Sign in with Apple" />

            <p className="signup-text">
                Don’t have an account? <Link to="/register">Sign up</Link>
            </p>

        </AuthLayout>
    );
};

export default Login;
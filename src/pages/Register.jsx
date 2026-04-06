import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import OptionsRow from "../components/OptionsRow/OptionsRow";

import "@/components/Authenticator/Login.scss";

import { authService } from "@/services/authService";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setErrorMessage("");
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setFieldErrors({
                confirmPassword: "Mật khẩu xác nhận không khớp"
            });
            return;
        }

        try {

            await authService.register({
                email: formData.email,
                password: formData.password
            });

            // lưu email để OTP page dùng
            localStorage.setItem("activateEmail", formData.email);

            // chuyển sang trang OTP
            navigate("/otpverify");

        } catch (error) {

            console.error(error);

            const data = error.response?.data;

            if (data?.errors) {
                setFieldErrors(data.errors);
            } else {
                setErrorMessage(data?.message || "Đăng ký thất bại");
            }
        }
    };

    return (
        <AuthLayout>

            <h1 className="login-title">Get Started Now</h1>

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

                <InputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    error={fieldErrors.confirmPassword}
                />

                <OptionsRow>
                    <label className="remember-me">
                        <input type="checkbox" required />
                        <span>
                            I agree to the{" "}
                            <Link to="/terms" className="policy-link">
                                terms & policy
                            </Link>
                        </span>
                    </label>
                </OptionsRow>

                <button type="submit" className="login-btn">
                    Sign Up
                </button>

                <p className="signup-text">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>

            </form>

        </AuthLayout>
    );
};

export default Register;
import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import SocialButton from "../components/Commons/SocialButton/SocialButton";

import { authService } from "@/services/authService";

import "@/components/Authenticator/Login.scss";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

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

        try {

            setLoading(true);

            await authService.forgotPassword(formData);

            localStorage.setItem("forgotEmail", formData.email);

            navigate("/otpverifyforgotpassword");

        } catch (error) {

            console.error(error);

            if (!error.response) {
                setErrorMessage("Không thể kết nối server");
                return;
            }

            const data = error.response.data;

            if (data?.errors) {
                setFieldErrors(data.errors);
            } else {
                setErrorMessage(data?.message || "Gửi OTP thất bại");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>

            <h1 className="login-title">Forgot Password</h1>

            <p className="subtitle">
                Don't worry! This happens often. Please enter your email address,
                and we will send the OTP code to it.
            </p>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <InputField
                    label="Email address"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                    error={fieldErrors.email}
                />

                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Continue"}
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
    );
};

export default ForgotPassword;
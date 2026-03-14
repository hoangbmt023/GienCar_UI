import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import SocialButton from "../components/Commons/SocialButton/SocialButton";

import "@/components/Authenticator/Login.scss";

const ForgotPassword = () => {
    return (
        <AuthLayout>

            <h1 className="login-title">Forgot Password</h1>

            <p className="subtitle">
                Don't worry! This happens often. Please enter your email address,
                and we will send the OTP code to it.
            </p>

            <form>

                <InputField
                    label="Email address"
                    type="email"
                    placeholder="Enter your email address"
                />

                <button type="submit" className="login-btn">
                    Continue
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
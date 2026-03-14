import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import OptionsRow from "../components/OptionsRow/OptionsRow";
import SocialButton from "../components/Commons/SocialButton/SocialButton";
import "@/components/Authenticator/Login.scss";

const ChangePassword = () => {
    return (
        <AuthLayout>
            <h1 className="login-title">Change Password</h1>

            <p className="subtitle">
                That’s good! Now enter the new password you want to save.
            </p>

            <form>
                <InputField
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                />

                <InputField
                    label="Confirm password"
                    type="password"
                    placeholder="Enter your confirm password"
                />

                <OptionsRow>
                    <label className="remember-me">
                        <input type="checkbox" />
                        Remember
                    </label>

                    <Link to="/forgot-password" className="forgot-link">
                        Forgot password?
                    </Link>
                </OptionsRow>

                <button type="submit" className="login-btn">
                    Confirm
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

export default ChangePassword;
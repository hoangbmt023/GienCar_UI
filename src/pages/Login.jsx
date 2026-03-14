import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { Link } from "react-router-dom";
import "@/components/Authenticator/Login.scss"
import AuthLayout from '../components/AuthLayout/AuthLayout';
import InputField from '../components/InputField/InputField';
import OptionsRow from '../components/OptionsRow/OptionsRow';
import SocialButton from '../components/Commons/SocialButton/SocialButton';

const Login = () => {
    return (
        <AuthLayout>
            <h1 className="login-title">Sign In</h1>

            <form>
                <InputField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                />

                <InputField
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
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
                    Sign In
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
                Don’t have an account?{" "}
                <Link to="/register">Sign up</Link>
            </p>

        </AuthLayout>
    );
};

export default Login;
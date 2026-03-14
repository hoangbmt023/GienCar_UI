import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import InputField from "../components/InputField/InputField";
import OptionsRow from "../components/OptionsRow/OptionsRow";
import "@/components/Authenticator/Login.scss";

const Register = () => {
    return (
        <AuthLayout>
            <h1 className="login-title">Get Started Now</h1>
            <form>
                <InputField
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                />

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

                <InputField
                    label="Phone Number"
                    type="text"
                    placeholder="Enter your phone number"
                />

                <OptionsRow>
                    <label className="remember-me">
                        <input type="checkbox" />
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
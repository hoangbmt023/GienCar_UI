import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import logo from '@/assets/logo/backgroundgiencar.jpg'
import "@/components/Authenticator/Login.scss"

export default function Register() {
    return (
        <div className='login-page'>
            <div className="login-left">
                <div className="body-register">
                    <div className="title-forgot">
                        <div className="text-wrapper">Get Started Now</div>
                    </div>
                    <div className="social-section">
                        <div className="lbl-or">
                            <span>OR</span>
                        </div>
                        <div className="social-buttons">
                            <div className="btn-signingoogle">
                                <div className="button-google">
                                    <div className="group">
                                        <div className="google">
                                            <img src={googleIcon} alt="Google" />
                                        </div>
                                        <div className="div">Sign up with Google</div>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-signupapple">
                                <div className="frame">
                                    <div className="button-apple">
                                        <div className="apple-logo">
                                            <img src={appleIcon} alt="Apple" />
                                        </div>
                                        <div className="text-wrapper-3">Sign up with Apple</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-fields">
                        <div className="input-email name">
                            <div className="text-wrapper-4">Full Name</div>
                            <div className="input">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="input-email email">
                            <div className="text-wrapper-4">Email Address</div>
                            <div className="input">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="input-email phone">
                            <div className="text-wrapper-4">Phone Number</div>
                            <div className="input">
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="input-password">
                            <div className="text-wrapper-4">Password</div>
                            <div className="input">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mdi-eye">
                        <img src={eyeIcon} alt="Eye" />
                    </div>

                    <button className="btn-login">
                        <div className="rectangle-2"></div>
                        <div className="text-wrapper-6">Register</div>
                    </button>

                    {/* Navigate */}
                    <div className="navigate-signup">
                        <div className="text-wrapper-7">Already have an account?</div>
                        <div className="text-wrapper-8">Login</div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <img src={logo} alt="Register" />
            </div>
        </div>
    )
}
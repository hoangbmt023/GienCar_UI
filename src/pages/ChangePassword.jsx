import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import logo from '@/assets/logo/backgroundgiencar.jpg'
import "@/components/Authenticator/Login.scss"

export default function ChangePassword() {
    return (
        <div className='login-page'>
            <div className="login-left">
                <div className="body-register">
                    <div className="title-forgot"><div className="text-wrapper">Change Password</div></div>
                    <div className="text-wrapper-sub">That’s good! Now enter the new password you want to save. </div>
                    <div className="social-section">
                        <div className="lbl-or">
                            <span>OR</span>
                        </div>
                        <div className="social-buttons">
                            <div className="btn-signingoogle">
                                <div className="button-google">
                                    <div className="group">
                                        <div className="google"><img src={googleIcon} alt="Google" /></div>
                                        <div className="div">Sign in with Google</div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-signupapple">
                                <div className="frame">
                                    <div className="button-apple">

                                        <div className="apple-logo"><img src={appleIcon} alt="Apple" /></div>
                                        <div className="text-wrapper-3">Sign in with Apple</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-password">
                        <div className="text-wrapper-4">New Password</div>
                        <div className="input">
                            <input type="password" placeholder="Enter your new password" className="input-field" />
                        </div>
                    </div>
                    <div className="input-password">
                        <div className="text-wrapper-4">Confirm Password</div>
                        <div className="input">
                            <input type="password" placeholder="Enter your confirm password" className="input-field" />
                        </div>
                    </div>
                    <button className="btn-login">
                        <div className="rectangle-2"></div>
                        <div className="text-wrapper-6">Confirm</div>
                    </button>
                    <div className="mdi-eye"><img src={eyeIcon} alt="Eye" /></div>
                    <div className="navigate-signup">
                        <div className="text-wrapper-7">Don’t have an account?</div>
                        <div className="text-wrapper-8">Sign Up</div>
                    </div>
                </div>
            </div>
            <div className="login-right">
                <img src={logo} alt="Login" />
            </div>
        </div>
    )
}
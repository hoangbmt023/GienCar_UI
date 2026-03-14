import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../components/AuthLayout/AuthLayout"
import SocialButton from "../components/Commons/SocialButton/SocialButton"

import "@/components/Authenticator/Login.scss"

const OTPVerifyPassword = () => {

    const inputsRef = useRef([])
    const [timer, setTimer] = useState(60)

    useEffect(() => {
        if (timer === 0) return

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timer])

    const handleResend = () => {
        console.log("Resend OTP...")
        setTimer(60)
    }

    const handleChange = (e, index) => {
        const value = e.target.value

        if (!/^[0-9]?$/.test(value)) return

        if (value && index < 3) {
            inputsRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const otp = inputsRef.current.map(input => input.value).join("")
        console.log("OTP:", otp)
    }

    return (
        <AuthLayout>
            <h1 className="login-title">OTP Verify Password</h1>

            <p className="subtitle">
                Please enter the OTP code you received from your email into the blank fields below!
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>OTP VERIFICATION</label>

                    <div className="otp-wrapper">
                        {[0, 1, 2, 3].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="otp-input"
                                ref={(el) => inputsRef.current[index] = el}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <div className="otp-resend">
                        <span>Don’t receive code?</span>

                        <button
                            type="button"
                            className="resend-btn"
                            onClick={handleResend}
                            disabled={timer > 0}
                        >
                            {timer > 0 ? `Re-send (${timer}s)` : "Re-send"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="login-btn">
                    OTP Verify
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
    )
}

export default OTPVerifyPassword
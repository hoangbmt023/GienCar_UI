import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'
import loginVideo from "../assets/video/login-video.mp4"
import React, { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
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
        // TODO: call API resend

        setTimer(60)
    }

    const handleChange = (e, index) => {
        const value = e.target.value

        // chỉ cho nhập số
        if (!/^[0-9]?$/.test(value)) return

        // nếu nhập 1 số thì nhảy sang ô tiếp
        if (value && index < 3) {
            inputsRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        // nếu bấm backspace mà ô trống thì quay lại ô trước
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const otp = inputsRef.current.map(input => input.value).join("")
        console.log("OTP:", otp)

        // TODO: gọi API verify ở đây
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-box">
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

                    <button className="social-btn">
                        <img src={googleIcon} alt="google" />
                        Sign in with Google
                    </button>

                    <button className="social-btn">
                        <img src={appleIcon} alt="apple" />
                        Sign in with Apple
                    </button>

                    <p className="signup-text">
                        Don’t have an account?{" "}
                        <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>

            <div className="login-right">
                <video
                    src={loginVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="login-video"
                />
            </div>
        </div>
    )
}

export default OTPVerifyPassword
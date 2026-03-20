import googleIcon from '@/assets/icons/google.svg'
import appleIcon from '@/assets/icons/apple.svg'

import { useRef, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import AuthLayout from "../components/AuthLayout/AuthLayout"
import SocialButton from "../components/Commons/SocialButton/SocialButton"

import { authService } from "@/services/authService"

import "@/components/Authenticator/Login.scss"

const OTPVerifyForgotPassword = () => {

    const inputsRef = useRef([])
    const navigate = useNavigate()

    const email = localStorage.getItem("forgotEmail")

    const [timer, setTimer] = useState(60)
    const [sending, setSending] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    // redirect nếu không có email
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password")
        }
    }, [email, navigate])

    // auto focus ô đầu
    useEffect(() => {
        inputsRef.current[0]?.focus()
    }, [])

    // countdown resend
    useEffect(() => {

        if (timer === 0) return

        const interval = setInterval(() => {
            setTimer(prev => prev - 1)
        }, 1000)

        return () => clearInterval(interval)

    }, [timer])

    const getOTP = () => {
        return inputsRef.current.map(input => input?.value || "").join("")
    }

    const verifyOTP = async () => {

        if (verifying) return

        const otp = getOTP()

        if (otp.length !== 6) {
            setErrorMessage("Vui lòng nhập đầy đủ OTP")
            return
        }

        setVerifying(true)

        try {

            await authService.verifyForgotPassword({
                email,
                otp
            })

            localStorage.setItem("otpVerified", "true")
            localStorage.setItem("forgotOtp", otp)

            navigate("/changepassword")

        } catch (error) {

            const data = error.response?.data

            if (data?.errors) {
                setErrorMessage(Object.values(data.errors).join(", "))
            } else {
                setErrorMessage(data?.message || "OTP không hợp lệ")
            }

        } finally {
            setVerifying(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        verifyOTP()
    }

    const handleResend = async () => {

        setSending(true)

        try {

            await authService.forgotPassword({ email })

            setTimer(60)

        } catch (error) {

            const data = error.response?.data

            if (error.response?.status === 429) {
                setErrorMessage(data?.message || "Bạn gửi OTP quá nhanh, vui lòng đợi")
            } else {
                setErrorMessage(data?.message || "Không thể gửi lại OTP")
            }

        } finally {
            setSending(false)
        }
    }

    const handleChange = (e, index) => {

        const value = e.target.value

        if (!/^[0-9]?$/.test(value)) return

        setErrorMessage("")

        if (value && index < 5) {
            inputsRef.current[index + 1].focus()
        }

        const otp = getOTP()

        if (otp.length === 6) {
            verifyOTP()
        }

    }

    const handleKeyDown = (e, index) => {

        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus()
        }

    }

    const handlePaste = (e) => {

        e.preventDefault()

        const paste = e.clipboardData.getData("text").trim()

        if (!/^\d{6}$/.test(paste)) return

        paste.split("").forEach((digit, index) => {

            if (inputsRef.current[index]) {
                inputsRef.current[index].value = digit
            }

        })

        inputsRef.current[5].focus()

        setTimeout(() => verifyOTP(), 100)

    }

    return (

        <AuthLayout>

            <h1 className="login-title">Verify OTP</h1>

            <p className="subtitle">
                Enter the OTP sent to <b>{email}</b>
            </p>

            {sending && (
                <div className="info-message">
                    Sending verification code...
                </div>
            )}

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>OTP VERIFICATION</label>

                    <div
                        className="otp-wrapper"
                        onPaste={handlePaste}
                    >

                        {[0, 1, 2, 3, 4, 5].map((_, index) => (

                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
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
                            disabled={timer > 0 || sending}
                        >

                            {timer > 0
                                ? `Re-send (${timer}s)`
                                : "Re-send"}

                        </button>

                    </div>

                </div>

                <button
                    type="submit"
                    className="login-btn"
                    disabled={verifying}
                >
                    {verifying ? "Verifying..." : "OTP Verify"}
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

export default OTPVerifyForgotPassword
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ChangePassword from '@/pages/ChangePassword'
import ForgotPassword from '@/pages/ForgotPassword'
import OTPVerifyPassword from '@/pages/OTPVerifyPassword'
import MainLayout from '@/components/MainLayout/MainLayout'
import OTPVerifyForgotPassword from '../pages/OTPVerifyForgotPassword'
import ProtectedRoute from './ProtectedRoute'
// import Racing from '@/pages/Racing'
// import SportsCars from '@/pages/SportsCars'
// import Collections from '@/pages/Collections'
// import Experiences from '@/pages/Experiences'
// import AboutUs from '@/pages/AboutUs'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
            </Route>
            {/* test routes cần đăng nhập
            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                </Route>

            </Route> */}

            {/* <Route path="/racing" element={<Racing />} />
            <Route path="/sports-cars" element={<SportsCars />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/about-us" element={<AboutUs />} /> */}
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/otpverify" element={<OTPVerifyPassword />} />
            <Route path="/otpverifyforgotpassword" element={<OTPVerifyForgotPassword />} />
        </Routes>
    )
}
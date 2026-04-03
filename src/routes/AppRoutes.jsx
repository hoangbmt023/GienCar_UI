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
import AdminLayout from '../components/Admin/AdminLayout/AdminLayout'
import ListMenuHome from '@/pages/Admin/Menu-Home'
import ListMenuHeaderFooter from '@/pages/Admin/Menu-Header-Footer'
import CarListPage from '../pages/CarList'
import CarDetailPage from '../pages/CarDetail'
import OrderPage from '@/pages/Order'
import OrderManagementPage from '@/pages/OrderManagementPage'
import ListCategory from '@/pages/Admin/Category'
import ListBrandes from '@/pages/Admin/Brandes'
import ListCarSeries from '@/pages/Admin/CarSeries'
import ListCars from '@/pages/Admin/Cars'
import ListCarsSpecifications from '@/pages/Admin/CarsSpecifications'
import ListColors from '@/pages/Admin/Color'
import ListCarColors from '@/pages/Admin/CarColor'
import PaymentResultPage from '@/pages/PaymentResultPage'
import OrderDetailPage from '@/pages/OrderDetail'
import MyOrderPage from '@/pages/MyOrder'
import ListBranches from '@/pages/Admin/Branches'
import ProfilePage from '@/pages/ProfilePage'
import ListUsers from '@/pages/Admin/User'
import Booking from '@/pages/Booking'
import BookingSuccess from '@/pages/BookingSuccess'
import BookingManagementPage from '@/pages/BookingManagementPage'
import ListBookingTimeSlots from '@/pages/Admin/BookingTimeSlot'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/models" element={<CarListPage />} />
                <Route path="/models/:slug" element={<CarDetailPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/orderdetail/:id" element={<OrderDetailPage />} />
                <Route path="/payment-result" element={<PaymentResultPage />} />
                <Route path="/my-orders" element={<MyOrderPage />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/booking-success/:id" element={<BookingSuccess />} />
            </Route>
            {/* test routes cần đăng nhập
            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                </Route>

            </Route> */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/otpverify" element={<OTPVerifyPassword />} />
            <Route path="/otpverifyforgotpassword" element={<OTPVerifyForgotPassword />} />
            <Route path="/ordermanager" element={<OrderManagementPage />} />
            <Route path="/bookingmanager" element={<BookingManagementPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Router Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="Menu-Home" element={<ListMenuHome />} />
                <Route path="Menu-Header-Footer" element={<ListMenuHeaderFooter />} />
                <Route path="danh-muc-xe" element={<ListCategory />} />
                <Route path="thuong-hieu-xe" element={<ListBrandes />} />
                <Route path="hang-xe" element={<ListCarSeries />} />
                <Route path="xe" element={<ListCars />} />
                <Route path="thong-so-ky-thuat" element={<ListCarsSpecifications />} />
                <Route path="list-mau-xe" element={<ListColors />} />
                <Route path="mau-xe" element={<ListCarColors />} />
                <Route path="chi-nhanh" element={<ListBranches />} />
                <Route path="nguoi-dung" element={<ListUsers />} />
                <Route path="bookingtimeslot" element={<ListBookingTimeSlots />} />
            </Route>
        </Routes>
    )
}
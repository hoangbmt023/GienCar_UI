import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from "@/components/Booking/BookingForm";
import "@/components/Authenticator/Booking.scss";

export default function Booking() {
    const navigate = useNavigate();
    const location = useLocation();

    // lấy car từ navigate state
    const car = location.state?.car;

    // nếu không có car → redirect
    if (!car) {
        return (
            <div className="booking-page">
                <h2>Không tìm thấy xe</h2>
                <button onClick={() => navigate("/")}>
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="booking-page container">

            <h2 className="booking-page__title" style={{ textAlign: "center", marginTop: "20px" }}>
                Đăng ký lái thử
            </h2>

            <div className="booking-page__content">

                {/* LEFT: thông tin xe */}
                <div className="booking-page__car">

                    <img
                        src={car.thumbnail || car.image}
                        alt={car.name}
                    />

                    <h3>{car.name}</h3>

                    <p className="booking-page__price">
                        {car.price?.toLocaleString()} VNĐ
                    </p>

                </div>

                {/* RIGHT: form */}
                <div className="booking-page__form">
                    <BookingForm car={car} />
                </div>

            </div>

        </div>
    );
}
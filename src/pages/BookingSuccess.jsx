import { useParams, useNavigate } from "react-router-dom";
import "@/components/Authenticator/Booking.scss";

export default function BookingSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="booking-success">

            <div className="booking-success__box">

                <h2>🎉 Đặt lịch lái thử thành công!</h2>

                <p>
                    Mã booking của bạn:
                    <strong> {id}</strong>
                </p>

                <p>
                    Chúng tôi sẽ liên hệ với bạn sớm để xác nhận lịch hẹn.
                </p>

                <div className="booking-success__actions">
                    <button onClick={() => navigate("/home")}>
                        Về trang chủ
                    </button>

                    <button onClick={() => navigate("/models")}>
                        Xem thêm xe
                    </button>
                </div>

            </div>

        </div>
    );
}
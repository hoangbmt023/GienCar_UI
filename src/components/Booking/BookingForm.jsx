import "./BookingForm.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "@/services/bookingService";

export default function BookingForm({ car }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        bookingDate: ""
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        try {
            if (!car?.id && !car?._id) {
                alert("Không tìm thấy xe");
                return;
            }

            if (!form.name || !form.phone) {
                alert("Vui lòng nhập đầy đủ thông tin");
                return;
            }

            if (!form.bookingDate) {
                alert("Vui lòng chọn ngày lái thử");
                return;
            }

            const payload = {
                name: form.name,
                phone: form.phone,
                email: form.email,
                carModelId: car?.id || car?._id,
                bookingDate: form.bookingDate
            };

            const res = await bookingService.create(payload);

            const bookingId = res.data.data.id;

            navigate(`/booking-success/${bookingId}`);

        } catch (err) {
            console.error("Lỗi booking:", err);

            if (err?.response?.status === 409) {
                alert("Ngày này đã có lịch, vui lòng chọn ngày khác");
            } else {
                alert("Đặt lịch thất bại");
            }
        }
    };

    return (
        <div className="booking-form">

            <h3 className="booking-form__title">
                Đăng ký lái thử xe
            </h3>

            {/* NAME */}
            <div className="booking-form__group">
                <label>Họ và tên</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                />
            </div>

            {/* PHONE + EMAIL */}
            <div className="booking-form__row">
                <div className="booking-form__group">
                    <label>Số điện thoại</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                <div className="booking-form__group">
                    <label>Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                    />
                </div>
            </div>

            {/* DATE */}
            <div className="booking-form__group">
                <label>Ngày lái thử</label>
                <input
                    type="date"
                    name="bookingDate"
                    value={form.bookingDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>

            {/* BUTTON */}
            <button className="booking__submit" onClick={handleSubmit}>
                Đặt lịch lái thử
            </button>

        </div>
    );
}
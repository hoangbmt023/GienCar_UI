import "./OrderForm.scss";
import { useState } from "react";

export default function OrderForm() {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="order-form">

            <h3 className="order-form__title">
                Thông tin đặt cọc
            </h3>

            <div className="order-form__group">
                <label>Họ và tên</label>
                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                />
            </div>

            <div className="order-form__row">
                <div className="order-form__group">
                    <label>Số điện thoại</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                <div className="order-form__group">
                    <label>Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                    />
                </div>

                <div className="order-form__group">
                    <label>Địa chỉ</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Ví dụ: 123 Nguyễn Văn A, Quận 1, TP.HCM"
                    />
                </div>
            </div>

            <div className="order-form__group">
                <label>Ghi chú</label>
                <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Nhập thêm yêu cầu..."
                />
            </div>

        </div>
    );
}
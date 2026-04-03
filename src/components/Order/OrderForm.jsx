import "./OrderForm.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";

export default function OrderForm({ data = null, readOnly = false, car }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: ""
    });

    // Populate khi ở OrderDetail
    useEffect(() => {
        if (data) {
            setForm({
                fullName: data.fullName || "",
                phone: data.phone || "",
                email: data.email || "",
                address: data.address || "",
                note: data.note || ""
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            // console.log("CAR:", car);
            // console.log("SELECTED COLOR:", car.selectedColor);
            // console.log("COLOR ID:", car.selectedColor?.colorId);
            // console.log("CAR COLORS:", car.exteriorColors);

            if (!car?.selectedColor?.colorId) {
                alert("Vui lòng chọn màu xe");
                return;
            }

            const payload = {
                userName: form.fullName,
                userPhone: form.phone,
                userEmail: form.email,
                userAddress: form.address,
                description: form.note,

                items: [
                    {
                        carId: car?.id || car?._id,
                        colorId: car.selectedColor?.colorId,
                        quantity: 1
                    }
                ]
            };

            // console.log("PAYLOAD:", payload);

            const res = await orderService.create(payload);

            const orderId = res.data.data.id;

            navigate(`/orderdetail/${orderId}`);
        } catch (err) {
            console.error("Lỗi tạo đơn:", err);
        }
    };

    return (
        <div className="order-form">

            <h3 className="order-form__title">
                Nhập thông tin đặt cọc
            </h3>

            <div className="order-form__group">
                <label>Họ và tên</label>
                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    disabled={readOnly}
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
                        disabled={readOnly}
                    />
                </div>

                <div className="order-form__group">
                    <label>Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                        disabled={readOnly}
                    />
                </div>

                <div className="order-form__group">
                    <label>Địa chỉ</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Ví dụ: 123 Nguyễn Văn A, Quận 1, TP.HCM"
                        disabled={readOnly}
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
                    disabled={readOnly}
                />
            </div>

            {!readOnly && (
                <button className="order__pay" onClick={handleSubmit}>
                    Đặt cọc ngay
                </button>
            )}

        </div>
    );
}
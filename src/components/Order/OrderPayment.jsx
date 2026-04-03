import "./OrderPayment.scss";
import { useState } from "react";
import vnpayLogo from "@/assets/logo/vnpay.png";
import momoLogo from "@/assets/logo/momo.png";
import { orderService } from "@/services/orderService";

export default function OrderPayment({ order }) {
    const [showPayment, setShowPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    // 🔥 LẤY DATA TỪ BACKEND
    const total = order?.totalPrice || 0;
    const deposit = order?.totalDeposit || 0;
    const percent = order?.orderItems?.[0]?.deposit?.percentage || 0;
    const orderId = order?.id;

    const format = (num) =>
        num.toLocaleString("vi-VN") + " VNĐ";

    const handlePayment = async (method) => {
        try {
            console.log("Thanh toán bằng:", method);

            if (method === "vnpay") {
                const res = await orderService.createVnpay(orderId);

                const paymentUrl = res.data.data.paymentUrl;

                window.location.href = paymentUrl;
            }

            if (method === "momo") {
                alert("MoMo chưa tích hợp");
            }

        } catch (err) {
            console.error("Lỗi thanh toán:", err);
            alert("Thanh toán thất bại!");
        }
    };

    return (
        <div className="order-payment">

            <h3 className="order-payment__title">
                Order summary
            </h3>

            <div className="order-payment__content">

                <div className="row">
                    <span>Total Cars</span>
                    <span>1</span>
                </div>

                <div className="row">
                    <span>Total</span>
                    <span>{format(total)}</span>
                </div>

                <hr className="divider" />

                <div className="row deposit">
                    <span>Đặt cọc ({percent * 100}%)</span>
                    <span>{format(deposit)}</span>
                </div>

            </div>

            {!showPayment && (
                <button
                    className="order-payment__btn"
                    onClick={() => setShowPayment(true)}
                >
                    Đặt cọc ngay
                </button>
            )}

            {showPayment && (
                <div className="payment-methods">

                    <div
                        className={`payment-method ${selectedMethod === "vnpay" ? "active" : ""}`}
                        onClick={() => setSelectedMethod("vnpay")}
                    >
                        <img src={vnpayLogo} alt="VNPay" />
                        <span>Thanh toán qua VNPay</span>
                    </div>

                    <div
                        className={`payment-method ${selectedMethod === "momo" ? "active" : ""}`}
                        onClick={() => setSelectedMethod("momo")}
                    >
                        <img src={momoLogo} alt="MoMo" />
                        <span>Thanh toán qua MoMo</span>
                    </div>

                    {selectedMethod && (
                        <button
                            className="order-payment__btn pay-btn"
                            onClick={() => handlePayment(selectedMethod)}
                        >
                            Thanh toán
                        </button>
                    )}

                </div>
            )}

        </div>
    );
}
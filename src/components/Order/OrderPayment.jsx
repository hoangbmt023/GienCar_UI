import "./OrderPayment.scss";
import { useState } from "react";
import vnpayLogo from "@/assets/logo/vnpay.png";
import momoLogo from "@/assets/logo/momo.png";

export default function OrderPayment({ car }) {
    const [showPayment, setShowPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    if (!car) return null;

    const parsePrice = (price) => {
        if (typeof price === "number") return price;

        return Number(
            price
                .replace(/[^\d]/g, "") // bỏ . , ₫ VNĐ
        );
    };

    const rawPrice = parsePrice(car.price);
    const deposit = rawPrice * 0.3;

    const format = (num) =>
        num.toLocaleString("vi-VN") + " VNĐ";

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
                    <span>{format(rawPrice)}</span>
                </div>

                {/* Divider */}
                <hr className="divider" />

                <div className="row deposit">
                    <span>Đặt cọc (30%)</span>
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

                    {/* NÚT THANH TOÁN */}
                    {selectedMethod && (
                        <button className="order-payment__btn pay-btn">
                            Thanh toán
                        </button>
                    )}

                </div>
            )}

        </div>
    );
}
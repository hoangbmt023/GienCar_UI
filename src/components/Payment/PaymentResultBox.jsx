import { useNavigate } from "react-router-dom";
import "./PaymentResultBox.scss";

export default function PaymentResultBox({
    success,
    message,
    orderCode,
    orderId
}) {
    const navigate = useNavigate();

    return (
        <div className="payment-result">
            {/* ICON */}
            <div className="payment-result__icon">
                {success ? "✅" : "❌"}
            </div>

            {/* TITLE */}
            <h2
                className={`payment-result__title ${success
                        ? "payment-result__title--success"
                        : "payment-result__title--fail"
                    }`}
            >
                {success
                    ? "Thanh toán thành công"
                    : "Thanh toán thất bại"}
            </h2>

            {/* MESSAGE */}
            <p className="payment-result__message">
                {message}
            </p>

            {/* INFO */}
            <div className="payment-result__info">
                <div>Mã đơn: {orderCode}</div>
                <div>ID: {orderId}</div>
            </div>

            {/* BUTTON */}
            <div className="payment-result__actions">
                {success ? (
                    <button
                        className="Btn Btn--primary"
                        onClick={() => navigate("/orders")}
                    >
                        Xem đơn hàng
                    </button>
                ) : (
                    <button
                        className="Btn Btn--danger"
                        onClick={() => navigate("/checkout")}
                    >
                        Thanh toán lại
                    </button>
                )}
            </div>
        </div>
    );
}
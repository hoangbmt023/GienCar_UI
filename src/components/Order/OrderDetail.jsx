import "./OrderDetail.scss";
import OrderPayment from "./OrderPayment";
import OrderForm from "./OrderForm";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";

export default function OrderDetail({ order }) {
    const navigate = useNavigate();

    if (!order) return null;

    const status = order.status; // 🔥 THÊM

    const isPaid = status === "PAY";
    const isCancelled = status === "CANCELLED";

    const item = order.orderItems?.[0];

    const car = {
        id: item?.carId,
        name: item?.carName,
        image: item?.carColor?.imageUrls?.[0],
        price: item?.price
    };

    const quantity = item?.quantity || 1;

    const customer = {
        fullName: order.userName,
        phone: order.userPhone,
        email: order.userEmail,
        address: order.userAddress,
        note: order.description
    };

    const handleCancelOrder = async () => {
        const confirmCancel = window.confirm("Bạn có chắc muốn huỷ đơn này?");
        if (!confirmCancel) return;

        try {
            await orderService.cancel(order.id);

            alert("Huỷ đơn thành công!");
            navigate("/my-orders");

        } catch (err) {
            console.error("Lỗi huỷ đơn:", err);
            alert("Huỷ đơn thất bại!");
        }
    };

    return (
        <div className="order-detail">
            <div className="order-detail__left">
                <h2 className="order-detail__title">Order detail</h2>

                <p className={`order-status ${status?.toLowerCase()}`}>
                    Trạng thái: {
                        status === "PENDING"
                            ? "Đang chờ"
                            : status === "PAY"
                                ? "Đã thanh toán"
                                : status === "CANCELLED"
                                    ? "Đã huỷ"
                                    : status
                    }
                </p>

                <div className="order-detail-header">
                    <span className="col-model">Model</span>
                    <span>Quantity</span>
                    <span>Price</span>
                </div>

                <div className="order-detail-item">
                    <div className="order-detail-item__image">
                        <img src={car?.image} alt={car?.name} />
                    </div>

                    <div className="order-detail-item__info">
                        <h3>{car?.name}</h3>
                    </div>

                    <div className="order-detail-item__qty">
                        <span>{quantity}</span>
                    </div>

                    <div className="order-detail-item__price">
                        {car?.price}
                    </div>
                </div>

                <OrderForm data={customer} readOnly />

                {/* 🔥 CHỈ HIỆN NÚT HUỶ KHI PENDING */}
                {status === "PENDING" && (
                    <button
                        className="order-detail__cancel-btn"
                        onClick={handleCancelOrder}
                    >
                        Huỷ đơn đặt cọc
                    </button>
                )}

            </div>

            <div className="order-detail__right">

                {status === "PENDING" ? (
                    <OrderPayment order={order} />
                ) : (
                    <div className="order-payment disabled">
                        <h3>Order summary</h3>
                        <p>
                            {isPaid
                                ? "Đơn hàng đã thanh toán"
                                : isCancelled
                                    ? "Đơn hàng đã bị huỷ"
                                    : "Trạng thái không xác định"}
                        </p>

                        <button
                            className="order-payment__btn pay-btn"
                            onClick={() => navigate("/my-orders")}
                        >
                            ← Quay lại đơn hàng
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}
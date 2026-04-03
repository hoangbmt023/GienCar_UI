import "./MyOrder.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";

export default function MyOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getMyOrders();

            console.log("MY ORDERS:", res.data);

            setOrders(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách đơn:", err);
        } finally {
            setLoading(false);
        }
    };

    const format = (num) =>
        num ? num.toLocaleString("vi-VN") + " VNĐ" : "0 VNĐ";

    const formatStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang chờ";
            case "PAID":
                return "Đã thanh toán";
            case "CANCELLED":
                return "Đã huỷ";
            default:
                return status;
        }
    };

    if (loading) return <p>Đang tải...</p>;

    if (!orders.length) {
        return <p>Bạn chưa có đơn hàng nào</p>;
    }

    return (
        <div className="my-order">

            <h2 className="my-order__title">Đơn hàng của tôi</h2>

            <div className="my-order__list">

                {[...orders].reverse().map((order) => {
                    const item = order?.orderItems?.[0];

                    const image =
                        item?.carColor?.imageUrls?.[0] ||
                        "https://via.placeholder.com/100x70";

                    return (
                        <div
                            key={order.id}
                            className="my-order__card"
                            onClick={() => navigate(`/orderdetail/${order.id}`)}
                        >
                            <img src={image} alt={item?.carName || "car"} />

                            <div className="info">
                                <h3>{item?.carName || "Không có tên xe"}</h3>
                                <p>Mã đơn: {order.orderCode}</p>
                                <p>
                                    Ngày:{" "}
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                                        : "---"}
                                </p>
                            </div>

                            <div className="price">
                                <p>{format(order.totalPrice)}</p>
                                <span className={`status ${order.status?.toLowerCase()}`}>
                                    {formatStatus(order.status)}
                                </span>
                            </div>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}
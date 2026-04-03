import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import OrderDetailComponent from "@/components/Order/OrderDetail";

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderService.getById(id);

                setOrder(res.data.data);
            } catch (err) {
                console.error("Lỗi lấy order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);
    console.log("ORDER DETAIL:", order);
    if (loading) return <p>Đang tải...</p>;
    if (!order) return <p>Không tìm thấy đơn hàng</p>;

    return (
        <main>
            <OrderDetailComponent order={order} />
        </main>
    );
}
import { useEffect, useState } from "react";
import OrderTabs from "@/components/SALE/OrderTabs";
import OrderTable from "@/components/SALE/OrderTable";
import RenderPagination from "@/components/Commons/RenderPagination/RenderPagination";
import { orderService } from "@/services/orderService";
import "@/components/Authenticator/OrderManagementPage.scss";

export default function OrderManagementPage() {
    const [active, setActive] = useState("ALL");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        last: 1,
        limit: 10,
        total: 0
    });

    useEffect(() => {
        fetchOrders(1);
    }, []);

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);

            const res = await orderService.getAll({
                page,
                limit: pagination.limit
            });

            const data = res.data?.data || [];
            const paginationData = res.data?.pagination || {};

            setOrders(data);
            setPagination(paginationData);
        } catch (err) {
            console.error(err);
            setError("Lỗi khi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchOrders(newPage);
    };

    const filteredOrders =
        active === "ALL"
            ? orders
            : orders.filter((o) => o.status === active);

    return (
        <div className="order-page">
            <div className="order-container">
                <h2>Quản lý đơn hàng</h2>

                <OrderTabs active={active} setActive={setActive} />

                {loading && <p>Đang tải dữ liệu...</p>}

                {error && <p className="error">{error}</p>}

                {!loading && !error && (
                    <>
                        <OrderTable
                            orders={filteredOrders}
                            onReload={() => fetchOrders(pagination.page)}
                        />

                        <RenderPagination
                            data={pagination}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
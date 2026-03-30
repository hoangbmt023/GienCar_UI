import { useState } from "react";
import OrderTabs from "@/components/staff/OrderTabs";
import OrderTable from "@/components/staff/OrderTable";
import "@/components/Authenticator/OrderManagementPage.scss";

export default function OrderManagementPage() {
    const [active, setActive] = useState("ALL");

    const orders = [
        {
            id: "ORD001",
            user: "Nguyễn Văn A",
            car: "Toyota Camry",
            status: "PENDING"
        },
        {
            id: "ORD002",
            user: "Trần Văn B",
            car: "Honda Civic",
            status: "CONFIRMED"
        },
        {
            id: "ORD003",
            user: "Lê Văn C",
            car: "Mazda CX5",
            status: "TEST_DRIVE"
        },
        {
            id: "ORD004",
            user: "Phạm Văn D",
            car: "Kia Seltos",
            status: "PENDING"
        }
    ];

    // filter theo tab
    const filteredOrders =
        active === "ALL"
            ? orders
            : orders.filter((o) => o.status === active);

    return (
        <div className="order-page">
            <div className="order-container">
                <h2>Quản lý đơn hàng</h2>

                <OrderTabs active={active} setActive={setActive} />
                <OrderTable orders={filteredOrders} />
            </div>
        </div>
    );
}
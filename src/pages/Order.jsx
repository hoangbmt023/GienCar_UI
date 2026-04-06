import { useLocation } from "react-router-dom";
import OrderSummary from "@/components/Order/OrderSummary";

export default function OrderPage() {
    const { state } = useLocation();

    const car = state?.car;

    if (!car) return <p>Không có dữ liệu xe</p>;

    return (
        <main>
            <OrderSummary car={car} />
        </main>
    );
}
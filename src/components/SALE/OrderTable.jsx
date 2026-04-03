import OrderRow from "./OrderRow";
import "./OrderTable.scss";

export default function OrderTable({ orders, onReload }) {
    return (
        <table className="order-table">
            <thead>
                <tr>
                    <th>Khách</th>
                    <th>Xe</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                {orders.map((o) => (
                    <OrderRow key={o.id} order={o} onReload={onReload} />
                ))}
            </tbody>
        </table>
    );
}
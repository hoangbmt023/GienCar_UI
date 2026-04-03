import OrderActions from "./OrderActions";
import "./OrderRow.scss";

export default function OrderRow({ order, onReload }) {
    return (
        <tr className="order-row">
            {/* Khách */}
            <td className="order-row__user">
                {order.userName || "N/A"}
            </td>

            {/* Xe */}
            <td className="order-row__car">
                {order.orderItems?.[0]?.carName || "N/A"}
            </td>

            {/* Status */}
            <td className={`order-row__status status-${order.status?.toLowerCase()}`}>
                {order.status}
            </td>

            {/* Actions */}
            <td className="order-row__actions">
                <OrderActions order={order} onReload={onReload} />
            </td>
        </tr>
    );
}
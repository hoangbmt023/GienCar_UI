import OrderActions from "./OrderActions";
import "./OrderRow.scss";

export default function OrderRow({ order }) {
    return (
        <tr className="order-row">
            <td className="order-row__id">{order.id}</td>
            <td className="order-row__user">{order.user}</td>
            <td className="order-row__car">{order.car}</td>

            <td className={`order-row__status status-${order.status.toLowerCase()}`}>
                {order.status}
            </td>

            <td className="order-row__actions">
                <OrderActions order={order} />
            </td>
        </tr>
    );
}
import "./OrderSummary.scss";
import OrderForm from "./OrderForm";

export default function OrderSummary({ car }) {
    if (!car) return null;

    const total = car.priceNumber || 0; // nhớ có field number
    const deposit = total * 0.3;

    const format = (num) =>
        num.toLocaleString("vi-VN") + " VNĐ";

    return (
        <div className="order">

            <h2 className="order__title">Tổng quan về đơn đặt cọc</h2>

            {/* HEADER */}
            <div className="order-header">
                <span className="col-model">Model</span>
                <span>Quantity</span>
                <span>Price</span>
            </div>

            {/* ITEM */}
            <div className="order-item">

                <div className="order-item__image">
                    <img src={car.image} alt={car.name} />
                </div>

                <div className="order-item__info">
                    <h3 className="order-item__name">{car.name}</h3>
                    <p className="order-item__desc">
                        {car.power} • {car.topSpeed}
                    </p>
                </div>

                <div className="order-item__qty">
                    <span>1</span>
                </div>

                <div className="order-item__price">
                    {car.price}
                </div>

            </div>

            {/* FORM */}
            <OrderForm car={car} />

        </div>
    );
}
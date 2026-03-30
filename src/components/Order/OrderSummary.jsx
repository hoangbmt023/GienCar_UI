import "./OrderSummary.scss";
import OrderPayment from "./OrderPayment";
import OrderForm from "./OrderForm";

export default function OrderSummary({ car }) {
    if (!car) return null;

    return (
        <div className="order">

            {/* LEFT */}
            <div className="order__left">
                <h2 className="order__title">Order overview</h2>

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
                <OrderForm />
            </div>

            {/* RIGHT */}
            <div className="order__right">
                <OrderPayment car={car} />
            </div>

        </div>
    );
}
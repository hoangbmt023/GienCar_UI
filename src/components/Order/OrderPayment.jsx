import "./OrderPayment.scss";

export default function OrderPayment({ car }) {
    if (!car) return null;

    // demo tạm
    const rawPrice = 5080000000;
    const deposit = rawPrice * 0.1;

    const format = (num) =>
        num.toLocaleString("vi-VN") + " VNĐ";

    return (
        <div className="order-payment">

            <h3 className="order-payment__title">
                Order summary
            </h3>

            <div className="order-payment__content">

                <div className="row">
                    <span>Total Cars</span>
                    <span>1</span>
                </div>

                <div className="row">
                    <span>Total</span>
                    <span>{car.price}</span>
                </div>

                {/* Divider */}
                <hr className="divider" />

                <div className="row deposit">
                    <span>Đặt cọc (10%)</span>
                    <span>{format(deposit)}</span>
                </div>

            </div>

            <button className="order-payment__btn">
                Đặt cọc ngay
            </button>

        </div>
    );
}
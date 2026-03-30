import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import "./OrderActions.scss";

export default function OrderActions({ order }) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        console.log("Confirm order:", order.id);
        setOpen(false);
    };

    return (
        <>
            <div className="order-actions">
                <button
                    className="order-actions__btn confirm"
                    onClick={() => setOpen(true)}
                >
                    Xác nhận
                </button>

                <ConfirmModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={handleConfirm}
                    message="Bạn có chắc muốn xác nhận đơn hàng này?"
                />
            </div>
        </>
    );
}
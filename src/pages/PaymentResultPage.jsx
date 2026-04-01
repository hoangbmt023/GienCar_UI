import { useLocation } from "react-router-dom";
import PaymentResultBox from "@/components/Payment/PaymentResultBox";

export default function PaymentResultPage() {
    const { search } = useLocation();

    const params = new URLSearchParams(search);

    const success = params.get("success") === "true";
    const message = decodeURIComponent(params.get("message") || "");
    const orderCode = params.get("orderCode");
    const orderId = params.get("orderId");

    return (
        <div
            style={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f6fa"
            }}
        >
            <PaymentResultBox
                success={success}
                message={message}
                orderCode={orderCode}
                orderId={orderId}
            />
        </div>
    );
}
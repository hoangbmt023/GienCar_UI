import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { orderService } from "@/services/orderService";
import Select from "../Admin/FormControls/Select";
import "./OrderActions.scss";

export default function OrderActions({ order, onReload }) {
    const [modal, setModal] = useState({
        open: false,
        type: null
    });

    const [loadingAction, setLoadingAction] = useState(false);
    const [loadingBranch, setLoadingBranch] = useState(false);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

    // 🔥 FIX: load branch trước, rồi mới mở modal
    const openModal = async (type) => {
        if (type === "confirm" && branches.length === 0) {
            try {
                setLoadingBranch(true);

                const res = await orderService.branches.getAll();
                setBranches(res.data?.data || res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingBranch(false);
            }
        }

        setModal({ open: true, type });
    };

    const closeModal = () => {
        setModal({ open: false, type: null });
        setSelectedBranch("");
    };

    const handleAction = async () => {
        try {
            setLoadingAction(true);

            if (modal.type === "confirmPaid") {
                await orderService.confirmPaid(order.id);
            }

            if (modal.type === "confirm") {
                if (!selectedBranch) return;

                await orderService.confirm(order.id, {
                    branchId: selectedBranch
                });
            }

            if (modal.type === "cancel") {
                await orderService.cancel(order.id);
            }

            closeModal();
            onReload && onReload();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAction(false);
        }
    };

    const renderActions = () => {
        switch (order.status) {
            case "PENDING":
                return (
                    <button
                        className="order-actions__btn cancel"
                        onClick={() => openModal("cancel")}
                    >
                        Hủy
                    </button>
                );

            case "PAY":
                return (
                    <>
                        <button
                            className="order-actions__btn confirm"
                            onClick={() => openModal("confirmPaid")}
                            disabled={loadingAction}
                        >
                            {loadingAction ? "Đang xử lý..." : "Xác nhận tiền"}
                        </button>

                        <button
                            className="order-actions__btn cancel"
                            onClick={() => openModal("cancel")}
                        >
                            Hủy
                        </button>
                    </>
                );

            case "PAID":
                return (
                    <button
                        className="order-actions__btn confirm"
                        onClick={() => openModal("confirm")}
                        disabled={loadingAction}
                    >
                        {loadingAction ? "Đang xử lý..." : "Hoàn tất"}
                    </button>
                );

            case "CONFIRMED":
            case "CANCELLED":
                return null;

            default:
                return null;
        }
    };

    const getModalContent = () => {
        switch (modal.type) {
            case "confirmPaid":
                return {
                    title: "Xác nhận đã nhận tiền",
                    message: "Bạn có chắc đã nhận tiền từ khách?"
                };
            case "confirm":
                return {
                    title: "Hoàn tất đơn hàng",
                    message: "Vui lòng chọn chi nhánh nhận xe"
                };
            case "cancel":
                return {
                    title: "Hủy đơn hàng",
                    message: "Bạn có chắc muốn hủy đơn này?"
                };
            default:
                return {};
        }
    };

    const { title, message } = getModalContent();

    return (
        <>
            <div className="order-actions">
                {renderActions()}
            </div>

            <ConfirmModal
                open={modal.open}
                onClose={closeModal}
                onConfirm={handleAction}
                title={title}
                message={message}
                loading={loadingAction} // 🔥 FIX QUAN TRỌNG
            >
                {modal.type === "confirm" && (
                    <>
                        {loadingBranch ? (
                            <p>Đang tải chi nhánh...</p>
                        ) : (
                            <Select
                                label="Chọn chi nhánh"
                                required
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                options={[
                                    { value: "", label: "-- Chọn chi nhánh --" },
                                    ...branches.map((b) => ({
                                        value: b.id,
                                        label: b.name
                                    }))
                                ]}
                                error={!selectedBranch ? "Vui lòng chọn chi nhánh" : ""}
                            />
                        )}
                    </>
                )}
            </ConfirmModal>
        </>
    );
}
import Modal from "./Modal";

export default function ConfirmModal({
    open,
    title = "Xác nhận",
    message = "Bạn có chắc chắn không?",
    confirmText = "Xác nhận",
    cancelText = "Huỷ",
    onConfirm,
    onCancel,
    danger = false,
    loading = false,
}) {
    const footer = (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
                type="button"
                className="Btn Btn--ghost"
                onClick={onCancel}
                disabled={loading}
            >
                {cancelText}
            </button>

            <button
                type="button"
                className={`Btn ${danger ? "Btn--danger" : "Btn--primary"}`}
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? "Đang xử lý..." : confirmText}
            </button>
        </div>
    );

    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            size="sm"
            footer={footer}
        >
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "#525f7f" }}>
                {message}
            </div>
        </Modal>
    );
}

import "./ConfirmModal.scss";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc muốn thực hiện hành động này?",
    children,
    loading
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{title}</h3>
                <p>{message}</p>

                {/* 🔥 chỗ render select */}
                {children}

                <div className="modal-actions">
                    <button onClick={onClose} disabled={loading}>
                        Hủy
                    </button>

                    <button
                        onClick={onConfirm}
                        className="danger"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}
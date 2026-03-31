import "./ConfirmModal.scss";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc muốn thực hiện hành động này?"
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{title}</h3>
                <p>{message}</p>

                <div className="modal-actions">
                    <button onClick={onClose}>Hủy</button>
                    <button onClick={onConfirm} className="danger">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
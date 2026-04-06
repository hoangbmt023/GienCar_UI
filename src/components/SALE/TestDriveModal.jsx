import { useState } from "react";
import "./TestDriveModal.scss";

export default function TestDriveModal({
    open,
    onClose,
    onConfirm,
    order
}) {
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!date) {
            alert("Vui lòng chọn ngày test drive");
            return;
        }

        onConfirm({
            orderId: order.id,
            date,
            note
        });

        setDate("");
        setNote("");
        onClose();
    };

    return (
        <div className="testdrive-modal">
            <div className="testdrive-modal__overlay" onClick={onClose}></div>

            <div className="testdrive-modal__box">
                <h3>Đặt lịch Test Drive</h3>

                <div className="testdrive-modal__form">
                    <label>Ngày test drive</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <label>Ghi chú</label>
                    <textarea
                        placeholder="Nhập ghi chú..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className="testdrive-modal__actions">
                    <button onClick={onClose}>Hủy</button>
                    <button className="confirm" onClick={handleSubmit}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
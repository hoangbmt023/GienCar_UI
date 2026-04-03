import "./BookingTable.scss";

export default function BookingTable({
    data,
    loading,
    onConfirm,
    onCancel,
    timeSlots,
    selectedSlots,
    onSelectSlot,
    loadingIds
}) {

    if (loading) return <p>Đang tải...</p>;

    if (!data.length) return <p>Không có booking</p>;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN");

    return (
        <table className="booking-table">
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Ngày</th>
                    <th>TimeSlot</th>
                    <th>Trạng thái</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {data.map((b) => {
                    const isPending = b.status?.toUpperCase() === "PENDING";
                    const isEmptySlot = !b.timeSlot || b.timeSlot === "-";

                    return (
                        <tr key={b.id}>
                            <td>{b.name}</td>
                            <td>{b.phone}</td>
                            <td>{b.email}</td>
                            <td>{formatDate(b.bookingDate)}</td>

                            {/* TIME SLOT */}
                            <td>
                                {isPending && isEmptySlot ? (
                                    <select
                                        value={selectedSlots?.[b.id] || ""}
                                        onChange={(e) =>
                                            onSelectSlot(b.id, e.target.value)
                                        }
                                        disabled={loadingIds?.[b.id]}
                                    >
                                        <option value="">Chọn giờ</option>
                                        {timeSlots?.map((slot) => (
                                            <option key={slot.id} value={slot.id}>
                                                {slot.timeLabel}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    b.timeSlot || "-"
                                )}
                            </td>

                            {/* STATUS */}
                            <td>
                                <span className={`status ${b.status?.toLowerCase()}`}>
                                    {b.status}
                                </span>
                            </td>

                            {/* ACTION */}
                            <td>
                                <div className="actions">
                                    {isPending && (
                                        <>
                                            <button
                                                className="confirm"
                                                onClick={() => onConfirm(b.id)}
                                                disabled={!selectedSlots?.[b.id] || loadingIds?.[b.id]}
                                            >
                                                {loadingIds?.[b.id] ? "Đang xử lý..." : "Confirm"}
                                            </button>

                                            <button
                                                className="cancel"
                                                onClick={() => onCancel(b.id)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
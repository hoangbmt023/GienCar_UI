import { useEffect, useState } from "react";
import { bookingService } from "@/services/bookingService";
import BookingTable from "@/components/Booking/BookingTable";
import "@/components/Authenticator/BookingManagementPage.scss";

export default function BookingManagementPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [loadingIds, setLoadingIds] = useState({});

    // lưu slot theo từng booking
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState({});

    useEffect(() => {
        fetchBookings();
    }, [status]);

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const res = await bookingService.getAll({
                status,
                page: 1,
                size: 10,
                sortBy: "createdAt",
                sortDir: "desc"
            });

            setBookings(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi load booking:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const res = await bookingService.getActiveTimeSlots();
            setTimeSlots(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi load time slots:", err);
        }
    };

    // chọn slot theo từng booking
    const handleSelectSlot = (bookingId, slotId) => {
        setSelectedSlots((prev) => ({
            ...prev,
            [bookingId]: slotId
        }));
    };

    const handleConfirm = async (id) => {
        try {
            const timeSlotId = selectedSlots[id];

            if (!timeSlotId) {
                alert("Vui lòng chọn khung giờ");
                return;
            }

            // set loading cho row này
            setLoadingIds((prev) => ({
                ...prev,
                [id]: true
            }));

            await bookingService.confirm(id, { timeSlotId });

            // reset slot
            setSelectedSlots((prev) => ({
                ...prev,
                [id]: ""
            }));

            fetchBookings();
        } catch (err) {
            console.error("Confirm lỗi:", err);
        } finally {
            // tắt loading
            setLoadingIds((prev) => ({
                ...prev,
                [id]: false
            }));
        }
    };

    const handleCancel = async (id) => {
        try {
            const reason = prompt("Nhập lý do huỷ:");
            if (!reason) return;

            await bookingService.cancel(id, { reason });
            fetchBookings();
        } catch (err) {
            console.error("Cancel lỗi:", err);
        }
    };

    return (
        <div className="booking-management">

            <h2 className="booking-management__title">
                Quản lý Booking
            </h2>

            {/* FILTER */}
            <div className="booking-management__filter">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>

            <div className="booking-management__table">
                <BookingTable
                    data={bookings}
                    loading={loading}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    timeSlots={timeSlots}
                    selectedSlots={selectedSlots}
                    onSelectSlot={handleSelectSlot}
                    loadingIds={loadingIds}
                />
            </div>

        </div>
    );
}
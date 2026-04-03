import { useEffect, useState } from "react";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    startTime: "",
    endTime: "",
    isActive: true,
};

export default function BookingTimeSlotForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialValues?.timeLabel) {
            // parse "09:00 - 10:00"
            const [start, end] = initialValues.timeLabel.split(" - ");

            setForm({
                startTime: start || "",
                endTime: end || "",
                isActive: initialValues.isActive ?? true,
            });
        } else {
            setForm(emptyForm);
        }

        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;

        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};

        if (!form.startTime || !form.endTime) {
            e.time = "Vui lòng chọn đầy đủ giờ";
        }

        if (form.startTime >= form.endTime) {
            e.time = "Giờ kết thúc phải lớn hơn giờ bắt đầu";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const payload = {
            timeLabel: `${form.startTime} - ${form.endTime}`,
            isActive: form.isActive,
        };

        await onSubmit?.(payload);
    };

    return (
        <form onSubmit={handleSubmit}>

            {/* TIME PICKER */}
            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <label>Giờ bắt đầu *</label>
                    <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => setField("startTime", e.target.value)}
                        disabled={loading || readOnly}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <label>Giờ kết thúc *</label>
                    <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => setField("endTime", e.target.value)}
                        disabled={loading || readOnly}
                    />
                </div>
            </div>

            {/* ERROR */}
            {errors.time && (
                <div style={{ color: "red", marginTop: 8 }}>
                    {errors.time}
                </div>
            )}

            {/* ACTIVE */}
            <div style={{ marginTop: 12 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setField("isActive", e.target.checked)}
                        disabled={loading || readOnly}
                    />
                    {" "}Đang hoạt động
                </label>
            </div>

            {/* ACTION */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 16,
                }}
            >
                <button
                    type="button"
                    className="Btn Btn--ghost"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Huỷ
                </button>

                <button
                    type="submit"
                    className="Btn Btn--primary"
                    disabled={loading || readOnly}
                >
                    {loading ? "Đang lưu..." : submitText}
                </button>
            </div>
        </form>
    );
}
import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Textarea from "@/components/Admin/FormControls/Textarea";
import Select from "@/components/Admin/FormControls/Select";
import Upload from "@/components/Admin/FormControls/Upload";
import DateTimeInput from "@/components/Admin/FormControls/DateTimeInput";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    title: "",
    description: "",
    imageFile: null,
    videoFile: null,
    ctaText: "",
    ctaLink: "",
    position: "",
    isActive: true,
    startDate: "",
    endDate: "",
};

export default function MenuHomeForm({
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
        setForm({
            ...emptyForm,
            ...initialValues,
        });
        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;

        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};
        if (!form.title.trim()) e.title = "Vui lòng nhập tiêu đề";
        if (!form.position) e.position = "Chọn vị trí";
        if (!form.startDate) e.startDate = "Chọn ngày bắt đầu";
        if (!form.endDate) e.endDate = "Chọn ngày kết thúc";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            ...form,
            title: form.title.trim(),
            description: form.description?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tiêu đề"
                required
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                error={errors.title}
                placeholder="Nhập tiêu đề"
                disabled={loading || readOnly}
            />

            <Textarea
                label="Mô tả"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Nhập mô tả"
                rows={4}
                disabled={loading || readOnly}
            />

            <Upload
                label="Ảnh"
                value={form.imageFile}
                onChange={(file) => setField("imageFile", file)}
            />

            <Upload
                label="Video"
                value={form.videoFile}
                onChange={(file) => setField("videoFile", file)}
                accept="video/*"
            />

            <Input
                label="CTA Text"
                value={form.ctaText}
                onChange={(e) => setField("ctaText", e.target.value)}
                placeholder="Ví dụ: Xem ngay"
            />

            <Input
                label="CTA Link"
                value={form.ctaLink}
                onChange={(e) => setField("ctaLink", e.target.value)}
                placeholder="https://..."
            />

            <Select
                label="Vị trí"
                required
                value={form.position}
                onChange={(e) => setField("position", e.target.value)}
                error={errors.position}
                options={[
                    { value: "HERO_CAR", label: "Hero Banner" },
                    { value: "CONTENT_CAR", label: "Content" },
                    { value: "FEATURED_CAR", label: "Featured" },
                ]}
            />

            <Select
                label="Trạng thái"
                value={form.isActive}
                onChange={(e) =>
                    setField("isActive", e.target.value === "true")
                }
                options={[
                    { value: "true", label: "Hoạt động" },
                    { value: "false", label: "Ẩn" },
                ]}
            />

            <div className="datepicker-wrapper">
                <label>
                    Ngày bắt đầu <span className="required">*</span>
                </label>
                <DateTimeInput
                    value={form.startDate}
                    onChange={(date) => setField("startDate", date)}
                    disabled={loading || readOnly}
                />
                {errors.startDate && (
                    <div className="datepicker-error">{errors.startDate}</div>
                )}
            </div>

            <div className="datepicker-wrapper">
                <label>
                    Ngày kết thúc <span className="required">*</span>
                </label>
                <DateTimeInput
                    value={form.endDate}
                    onChange={(date) => setField("endDate", date)}
                    disabled={loading || readOnly}
                />
                {errors.endDate && (
                    <div className="datepicker-error">{errors.endDate}</div>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
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
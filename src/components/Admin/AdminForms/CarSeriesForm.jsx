import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Textarea from "@/components/Admin/FormControls/Textarea";
import Select from "@/components/Admin/FormControls/Select";
import Upload from "@/components/Admin/FormControls/Upload";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    name: "",
    description: "",
    brandId: "",
    priceFrom: "",
    highlight: true,
    imageFile: null,
};

export default function CarSeriesForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    brandOptions = [] // 👈 truyền từ ngoài (list brand)
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...initialValues,
            imageFile: null // reset file khi edit
        });
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

        if (!form.name.trim()) {
            e.name = "Vui lòng nhập tên dòng xe";
        }

        if (!form.brandId) {
            e.brandId = "Vui lòng chọn brand";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const formData = new FormData();

        formData.append("name", form.name.trim());
        formData.append("brandId", form.brandId);

        if (form.description) {
            formData.append("description", form.description.trim());
        }

        if (form.priceFrom) {
            formData.append("priceFrom", form.priceFrom);
        }

        if (form.orderIndex !== "" && form.orderIndex !== undefined) {
            formData.append("orderIndex", form.orderIndex);
        }

        formData.append("highlight", form.highlight);

        if (form.imageFile) {
            formData.append("imageFile", form.imageFile);
        }

        await onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên dòng xe"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="Nhập tên dòng xe"
                disabled={loading || readOnly}
            />

            {/* DESCRIPTION */}
            <Textarea
                label="Mô tả"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Nhập mô tả"
                rows={4}
                disabled={loading || readOnly}
            />

            {/* BRAND */}
            <Select
                label="Brand"
                required
                value={form.brandId}
                onChange={(e) => setField("brandId", e.target.value)}
                error={errors.brandId}
                options={brandOptions}
                disabled={loading || readOnly}
            />

            {/* PRICE */}
            <Input
                label="Giá từ"
                type="number"
                value={form.priceFrom}
                onChange={(e) => setField("priceFrom", e.target.value)}
                placeholder="VD: 5000000000"
                disabled={loading || readOnly}
            />

            <Input
                label="Thứ tự hiển thị trên trang chủ (số càng nhỏ càng ưu tiên)"
                type="number"
                value={form.orderIndex || ""}
                onChange={(e) => setField("orderIndex", e.target.value)}
                placeholder="VD: 1, 2, 3..."
                disabled={loading || readOnly}
            />

            {/* HIGHLIGHT */}
            <Select
                label="Nổi bật"
                value={form.highlight}
                onChange={(e) =>
                    setField("highlight", e.target.value === "true")
                }
                options={[
                    { value: "true", label: "Có" },
                    { value: "false", label: "Không" }
                ]}
                disabled={loading || readOnly}
            />

            {/* IMAGE */}
            <Upload
                label="Hình ảnh"
                value={form.imageFile}
                onChange={(file) => setField("imageFile", file)}
            />

            {/* PREVIEW IMAGE */}
            {initialValues?.imageUrl && !form.imageFile && (
                <div style={{ marginTop: 10 }}>
                    <img
                        src={initialValues.imageUrl}
                        alt="preview"
                        style={{
                            width: 120,
                            height: 80,
                            objectFit: "cover"
                        }}
                    />
                </div>
            )}

            {/* ACTION */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 12,
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
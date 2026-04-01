import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Textarea from "@/components/Admin/FormControls/Textarea";
import Select from "@/components/Admin/FormControls/Select";
import Upload from "@/components/Admin/FormControls/Upload";
import "@/components/Admin/FormControls/FormControls.scss";
import UploadMultiple from "../FormControls/UploadMultiple";

const emptyForm = {
    name: "",
    categoryId: "",
    price: "",
    quantity: "",
    brandIds: [],
    depositPercentage: "",
    yearProduce: "",
    seriesId: "",
    description: "",
    status: "available",
    imageFiles: []
};

export default function CarsForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    carSeriesOptions = [],
    brandOptions = [],
    categoryOptions = []
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...(initialValues || {}),
            imageFiles: []
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

        if (!form.name || !form.name.trim()) {
            e.name = "Vui lòng nhập tên xe";
        }

        if (!form.seriesId) {
            e.seriesId = "Vui lòng chọn dòng xe";
        }

        if (!form.categoryId) {
            e.categoryId = "Vui lòng chọn category";
        }

        if (!form.price) {
            e.price = "Vui lòng nhập giá";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const formData = new FormData();

        // REQUIRED
        formData.append("name", form.name.trim());
        formData.append("categoryId", form.categoryId);
        formData.append("price", form.price);
        formData.append("seriesId", form.seriesId);

        // OPTIONAL
        if (form.quantity) {
            formData.append("quantity", form.quantity);
        }

        if (form.depositPercentage) {
            formData.append("depositPercentage", form.depositPercentage);
        }

        if (form.yearProduce) {
            formData.append("yearProduce", form.yearProduce);
        }

        if (form.description) {
            formData.append("description", form.description);
        }

        // 🔥 BRAND IDS (array)
        form.brandIds?.forEach((id) => {
            formData.append("brandIds", id);
        });

        // 🔥 MULTIPLE IMAGE FILES
        if (form.imageFiles?.length) {
            form.imageFiles.forEach((file) => {
                formData.append("imageFiles", file);
            });
        }

        // PUT only (optional nhưng không sao gửi luôn)
        if (form.status) {
            formData.append("status", form.status);
        }

        await onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên xe"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="Nhập tên xe"
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

            {/* CAR SERIES */}
            <Select
                label="Dòng xe"
                required
                value={form.seriesId}
                onChange={(e) => setField("seriesId", e.target.value)}
                options={carSeriesOptions}
            />

            <Input
                label="Số lượng"
                type="number"
                value={form.quantity}
                onChange={(e) => setField("quantity", e.target.value)}
                placeholder="VD: 10"
            />

            <Input
                label="Đặt cọc (%)"
                type="number"
                value={form.depositPercentage}
                onChange={(e) => setField("depositPercentage", e.target.value)}
                placeholder="VD: 0.1"
            />

            <Input
                label="Năm sản xuất"
                type="number"
                value={form.yearProduce}
                onChange={(e) => setField("yearProduce", e.target.value)}
                placeholder="VD: 2026"
            />

            {/* PRICE */}
            <Input
                label="Giá"
                type="number"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="VD: 3500000000"
                disabled={loading || readOnly}
            />

            {/* IMAGE */}
            <UploadMultiple
                label="Hình ảnh"
                value={form.imageFiles}
                onChange={(files) => setField("imageFiles", files)}
            />

            <Select
                label="Category"
                required
                value={form.categoryId}
                onChange={(e) => setField("categoryId", e.target.value)}
                options={categoryOptions}
            />

            <Select
                label="Brand"
                value={form.brandIds?.[0] || ""}
                onChange={(e) => setField("brandIds", [e.target.value])}
                options={brandOptions}
            />

            {/* PREVIEW */}
            {initialValues?.images?.[0]?.url && !form.imageFiles?.length && (
                <div style={{ marginTop: 10 }}>
                    <img
                        src={initialValues.images[0].url}
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
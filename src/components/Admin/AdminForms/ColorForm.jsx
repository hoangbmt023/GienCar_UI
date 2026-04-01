import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Textarea from "@/components/Admin/FormControls/Textarea";
import Upload from "@/components/Admin/FormControls/Upload";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    name: "",
    description: "",
    imageFile: null
};

export default function ColorForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...(initialValues || {}),
            imageFile: null // 🔥 reset file khi edit
        });
        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;

        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    // ================= VALIDATE =================
    const validate = () => {
        if (readOnly) return true;

        const e = {};

        if (!form.name || !form.name.trim()) {
            e.name = "Vui lòng nhập tên màu";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const formData = new FormData();

        // REQUIRED
        formData.append("name", form.name.trim());

        // OPTIONAL
        if (form.description) {
            formData.append("description", form.description.trim());
        }

        if (form.imageFile) {
            formData.append("imageFile", form.imageFile);
        }

        await onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên màu"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="VD: Black, Red..."
                disabled={loading || readOnly}
            />

            {/* DESCRIPTION */}
            <Textarea
                label="Mô tả"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Mô tả màu"
                rows={3}
                disabled={loading || readOnly}
            />

            {/* IMAGE */}
            <Upload
                label="Hình ảnh"
                value={form.imageFile}
                onChange={(file) => setField("imageFile", file)}
            />

            {/* PREVIEW IMAGE (edit mode) */}
            {initialValues?.imageUrl && !form.imageFile && (
                <div style={{ marginTop: 10 }}>
                    <img
                        src={initialValues.imageUrl}
                        alt="preview"
                        style={{
                            width: 100,
                            height: 70,
                            objectFit: "cover",
                            borderRadius: 6
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
                    marginTop: 16
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
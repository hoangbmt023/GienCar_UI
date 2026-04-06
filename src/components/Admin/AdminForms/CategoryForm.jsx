import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Textarea from "@/components/Admin/FormControls/Textarea";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    name: "",
    description: "",
};

export default function CategoryForm({
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

        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};

        if (!form.name.trim()) {
            e.name = "Vui lòng nhập tên category";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            ...form,
            name: form.name.trim(),
            description: form.description?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên category"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="Nhập tên category"
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
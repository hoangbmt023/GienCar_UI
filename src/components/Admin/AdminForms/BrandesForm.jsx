import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Upload from "@/components/Admin/FormControls/Upload";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    name: "",
    country: "",
    logoFile: null,
};

export default function BrandesForm({
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
            logoFile: null
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
            e.name = "Vui lòng nhập tên brand";
        }

        if (!form.country.trim()) {
            e.country = "Vui lòng nhập quốc gia";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        // convert sang FormData
        const formData = new FormData();
        formData.append("name", form.name.trim());
        formData.append("country", form.country.trim());

        if (form.logoFile) {
            formData.append("logoFile", form.logoFile);
        }

        await onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên brand"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="Nhập tên brand"
                disabled={loading || readOnly}
            />

            {/* COUNTRY */}
            <Input
                label="Quốc gia"
                required
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                error={errors.country}
                placeholder="Nhập quốc gia"
                disabled={loading || readOnly}
            />

            {/* LOGO */}
            <Upload
                label="Logo"
                value={form.logoFile}
                onChange={(file) => setField("logoFile", file)}
            />

            {/* PREVIEW IMAGE KHI EDIT */}
            {initialValues?.logo && !form.logoFile && (
                <div style={{ marginTop: 10 }}>
                    <img
                        src={initialValues.logo}
                        alt="logo"
                        style={{ width: 100, height: 100, objectFit: "contain" }}
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
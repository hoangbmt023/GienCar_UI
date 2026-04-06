import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Select from "@/components/Admin/FormControls/Select";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    name: "",
    url: "",
    isActive: true,
    locale: "VI",
    type: "HEADER",
    target: "SELF",
    parentId: "",
};

export default function MenuHeaderFooterForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    parentOptions = [],
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
        if (!form.name.trim()) e.name = "Nhập tên menu";
        if (!form.url.trim()) e.url = "Nhập URL";
        if (!form.type) e.type = "Chọn loại menu";

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
            url: form.url.trim(),

            locale: [form.locale],
            type: [form.type],
            target: [form.target],

            parentId: form.parentId || null,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Select
                label="Menu cha"
                value={form.parentId || ""}
                onChange={(e) => setField("parentId", e.target.value)}
                options={[
                    { value: "", label: "Menu gốc" },
                    ...(parentOptions || [])
                ]}
            />

            <Input
                label="Tên menu"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                placeholder="Nhập tên menu"
                disabled={loading || readOnly}
            />

            <Input
                label="URL"
                required
                value={form.url}
                onChange={(e) => setField("url", e.target.value)}
                error={errors.url}
                placeholder="/home hoặc https://..."
                disabled={loading || readOnly}
            />

            <Select
                label="Loại menu"
                value={form.type}
                onChange={(e) => setField("type", e.target.value)}
                error={errors.type}
                options={[
                    { value: "HEADER", label: "Header" },
                    { value: "FOOTER", label: "Footer" },
                ]}
            />

            <Select
                label="Ngôn ngữ"
                value={form.locale}
                onChange={(e) => setField("locale", e.target.value)}
                options={[
                    { value: "VI", label: "Tiếng Việt" },
                    { value: "EN", label: "English" },
                ]}
            />

            <Select
                label="Target"
                value={form.target}
                onChange={(e) => setField("target", e.target.value)}
                options={[
                    { value: "SELF", label: "Cùng tab" },
                    { value: "BLANK", label: "Tab mới" },
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
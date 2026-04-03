import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    email: "",
    roles: [],
    isBanned: false,
};

export default function UserForm({
    initialValues,
    onSubmit,
    onBan,
    onUnban,
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
            roles: initialValues?.roles?.map(r => r.toUpperCase()) || [],
            isBanned: initialValues?.status === "banned"
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

        if (!form.roles || form.roles.length === 0) {
            e.roles = "Vui lòng chọn ít nhất 1 quyền";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            roles: form.roles.map(r => r.toLowerCase())
        });
    };

    const toggleRole = (role) => {
        if (readOnly) return;

        const exists = form.roles.includes(role);

        if (exists) {
            setField(
                "roles",
                form.roles.filter((r) => r !== role)
            );
        } else {
            setField("roles", [...form.roles, role]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <Input
                label="Email"
                value={form.email}
                disabled
            />

            {/* ROLES */}
            <div style={{ marginTop: 12 }}>
                <label>Quyền</label>

                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    {["USER", "SALE", "ADMIN"].map((role) => (
                        <label key={role} style={{ cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={form.roles.includes(role)}
                                onChange={() => toggleRole(role)}
                                disabled={loading || readOnly}
                            />
                            {" "}{role}
                        </label>
                    ))}
                </div>

                {errors.roles && (
                    <div style={{ color: "red", fontSize: 12 }}>
                        {errors.roles}
                    </div>
                )}
            </div>

            {/* STATUS */}
            <div style={{ marginTop: 16 }}>
                <label>Trạng thái</label>

                <div style={{ marginTop: 6 }}>
                    {form.isBanned ? (
                        <span style={{ color: "red" }}>Đã bị khóa</span>
                    ) : (
                        <span style={{ color: "green" }}>Hoạt động</span>
                    )}
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginTop: 20,
                }}
            >
                {/* BAN / UNBAN */}
                {form.isBanned ? (
                    <button
                        type="button"
                        className="Btn Btn--primary"
                        onClick={() => onUnban?.(initialValues.id)}
                        disabled={loading}
                    >
                        Mở khóa
                    </button>
                ) : (
                    <button
                        type="button"
                        className="Btn Btn--danger"
                        onClick={() => onBan?.(initialValues.id)}
                        disabled={loading}
                    >
                        Khóa tài khoản
                    </button>
                )}

                <div style={{ display: "flex", gap: 10 }}>
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
            </div>
        </form>
    );
}
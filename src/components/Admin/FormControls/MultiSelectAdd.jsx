import { useEffect, useMemo, useState } from "react";
import "./FormControls.scss";

export default function MultiSelectAdd({
    label,
    required = false,
    error,
    hint,

    options = [],              // [{ value, label }]
    value = [],                // array of selected values
    onChange,                  // (nextValues) => void

    placeholder = "-- Chọn --",
    addLabel = "+",
    className = "",
    disabled = false,
}) {
    const [pick, setPick] = useState("");

    // map để render label nhanh
    const byValue = useMemo(() => {
        const m = new Map();
        options.forEach((o) => m.set(String(o.value), o.label));
        return m;
    }, [options]);

    const selectedSet = useMemo(() => new Set((value || []).map((v) => String(v))), [value]);

    // chỉ hiện các option chưa chọn
    const availableOptions = useMemo(() => {
        return options.filter((o) => !selectedSet.has(String(o.value)));
    }, [options, selectedSet]);

    useEffect(() => {
        // nếu pick không còn hợp lệ (option bị remove), reset
        if (pick && selectedSet.has(String(pick))) setPick("");
    }, [pick, selectedSet]);

    const canAdd = !disabled && pick !== "";

    const handleAdd = () => {
        if (!canAdd) return;
        const next = [...(value || []), Number(pick)].filter((x) => Number.isFinite(Number(x)));
        onChange?.(next);
        setPick("");
    };

    const handleRemove = (v) => {
        const next = (value || []).filter((x) => String(x) !== String(v));
        onChange?.(next);
    };

    return (
        <div className={`FC Field ${className}`}>
            {label ? (
                <label className="Field__label">
                    {label} {required ? <span className="Field__req">*</span> : null}
                </label>
            ) : null}

            <div className={`Field__control ${error ? "Field__control--error" : ""}`}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                        className="Field__select"
                        value={pick}
                        onChange={(e) => setPick(e.target.value)}
                        disabled={disabled}
                    >
                        <option value="">{placeholder}</option>
                        {availableOptions.map((opt) => (
                            <option key={String(opt.value)} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="Btn Btn--primary"
                        onClick={handleAdd}
                        disabled={!canAdd}
                        title="Thêm"
                        style={{ paddingInline: 12 }}
                    >
                        {addLabel}
                    </button>
                </div>

                {/* chips */}
                {value && value.length > 0 ? (
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {value.map((v) => (
                            <span
                                key={String(v)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    border: "1px solid rgba(0,0,0,0.12)",
                                    background: "rgba(0,0,0,0.02)",
                                    fontSize: 13,
                                }}
                            >
                                {byValue.get(String(v)) ?? String(v)}
                                <button
                                    type="button"
                                    className="Btn Btn--ghost"
                                    onClick={() => handleRemove(v)}
                                    disabled={disabled}
                                    style={{ padding: "2px 8px", lineHeight: 1 }}
                                    title="Bỏ"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>

            {error ? <div className="Field__error">{error}</div> : null}
            {!error && hint ? <div className="Field__hint">{hint}</div> : null}
        </div>
    );
}

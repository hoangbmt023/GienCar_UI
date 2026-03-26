import { useMemo } from "react";
import "./FormControls.scss";

export default function Upload({
    label,
    required = false,
    error,
    hint,
    accept = "image/*",
    value, // File | null
    onChange, // (file|null) => void
    className = "",
}) {
    const previewUrl = useMemo(() => {
        if (!value) return "";
        return URL.createObjectURL(value);
    }, [value]);

    return (
        <div className={`FC Field ${className}`}>
            {label ? (
                <label className="Field__label">
                    {label} {required ? <span className="Field__req">*</span> : null}
                </label>
            ) : null}

            <div className={`UploadBox ${error ? "UploadBox--error" : ""}`}>
                <input
                    className="UploadBox__input"
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange?.(file);
                    }}
                />

                <div className="UploadBox__content">
                    {value ? (
                        <div className="UploadBox__preview">
                            <img src={previewUrl} alt="preview" />
                        </div>
                    ) : (
                        <div className="UploadBox__placeholder">
                            Kéo thả hoặc bấm để chọn file
                        </div>
                    )}
                </div>

                {value ? (
                    <button
                        type="button"
                        className="UploadBox__remove"
                        onClick={() => onChange?.(null)}
                    >
                        Xoá
                    </button>
                ) : null}
            </div>

            {error ? <div className="Field__error">{error}</div> : null}
            {!error && hint ? <div className="Field__hint">{hint}</div> : null}
        </div>
    );
}

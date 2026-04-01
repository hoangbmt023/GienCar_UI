import { useMemo, useEffect } from "react";
import "./FormControls.scss";

export default function UploadMultiple({
    label,
    required = false,
    error,
    hint,
    accept = "image/*",
    value = [], // Array<File>
    onChange, // (files: File[]) => void
    className = "",
}) {
    // 👉 tạo preview URL
    const previewUrls = useMemo(() => {
        if (!value?.length) return [];
        return value.map((file) => URL.createObjectURL(file));
    }, [value]);

    // 👉 cleanup tránh memory leak
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    return (
        <div className={`FC Field ${className}`}>
            {label && (
                <label className="Field__label">
                    {label} {required && <span className="Field__req">*</span>}
                </label>
            )}

            <div className={`UploadBox ${error ? "UploadBox--error" : ""}`}>
                <input
                    className="UploadBox__input"
                    type="file"
                    accept={accept}
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        onChange?.(files);
                    }}
                />

                <div className="UploadBox__content">
                    {previewUrls.length > 0 ? (
                        <div
                            className="UploadBox__preview"
                            style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap"
                            }}
                        >
                            {previewUrls.map((url, i) => (
                                <div key={i} style={{ position: "relative" }}>
                                    <img
                                        src={url}
                                        alt="preview"
                                        style={{
                                            width: 80,
                                            height: 60,
                                            objectFit: "cover",
                                            borderRadius: 6
                                        }}
                                    />

                                    {/* nút xoá từng ảnh */}
                                    <button
                                        type="button"
                                        style={{
                                            position: "absolute",
                                            top: -5,
                                            right: -5,
                                            background: "red",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 18,
                                            height: 18,
                                            cursor: "pointer",
                                            fontSize: 12
                                        }}
                                        onClick={() => {
                                            const newFiles = value.filter((_, idx) => idx !== i);
                                            onChange?.(newFiles);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="UploadBox__placeholder">
                            Kéo thả hoặc chọn nhiều ảnh
                        </div>
                    )}
                </div>

                {/* xoá tất cả */}
                {value.length > 0 && (
                    <button
                        type="button"
                        className="UploadBox__remove"
                        onClick={() => onChange?.([])}
                    >
                        Xoá tất cả
                    </button>
                )}
            </div>

            {error && <div className="Field__error">{error}</div>}
            {!error && hint && <div className="Field__hint">{hint}</div>}
        </div>
    );
}
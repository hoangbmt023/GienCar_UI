import "./FormControls.scss";

export default function Select({
    label,
    required = false,
    error,
    hint,
    options = [],
    placeholder = "-- Chọn --",
    className = "",
    ...props
}) {
    return (
        <div className={`FC Field ${className}`}>
            {label ? (
                <label className="Field__label">
                    {label} {required ? <span className="Field__req">*</span> : null}
                </label>
            ) : null}

            <div className={`Field__control ${error ? "Field__control--error" : ""}`}>
                <select className="Field__select" {...props}>
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {options.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {error ? <div className="Field__error">{error}</div> : null}
            {!error && hint ? <div className="Field__hint">{hint}</div> : null}
        </div>
    );
}

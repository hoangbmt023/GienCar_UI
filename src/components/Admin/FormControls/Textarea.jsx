import "./FormControls.scss";

export default function Textarea({
    label,
    required = false,
    error,
    hint,
    rows = 4,
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
                <textarea className="Field__textarea" rows={rows} {...props} />
            </div>

            {error ? <div className="Field__error">{error}</div> : null}
            {!error && hint ? <div className="Field__hint">{hint}</div> : null}
        </div>
    );
}

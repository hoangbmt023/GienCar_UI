import "./FormControls.scss";

export default function Input({
    label,
    required = false,
    error,
    hint,
    leftIcon,
    rightIcon,
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
                {leftIcon ? <span className="Field__icon Field__icon--left">{leftIcon}</span> : null}

                <input className="Field__input" {...props} />

                {rightIcon ? <span className="Field__icon Field__icon--right">{rightIcon}</span> : null}
            </div>

            {error ? <div className="Field__error">{error}</div> : null}
            {!error && hint ? <div className="Field__hint">{hint}</div> : null}
        </div>
    );
}

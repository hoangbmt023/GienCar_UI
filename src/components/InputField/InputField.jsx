import "./InputField.scss";

function InputField({ label, type, name, placeholder, onChange, error }) {
    return (
        <div className="form-group">
            <label>{label}</label>

            <input
                type={type}
                name={name}
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder={placeholder}
                onChange={onChange}
            />

            {error && (
                <div className="field-error">
                    {error}
                </div>
            )}
        </div>
    );
}

export default InputField;
import "./InputField.scss";

function InputField({ label, type, placeholder }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                className="input-field"
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputField;
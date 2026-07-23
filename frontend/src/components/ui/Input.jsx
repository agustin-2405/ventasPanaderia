import "./input.css";

export default function Input({
  label,
  helper,
  error,
  icon: Icon,
  fullWidth = true,
  ...props
}) {
  return (
    <div className={`input-group ${fullWidth ? "input-full" : ""}`}>
      {label && <label className="input-label">{label}</label>}

      <div className="input-wrapper">
        {Icon && <Icon size={18} className="input-icon" />}

        <input className={`input ${error ? "input-error" : ""}`} {...props} />
      </div>

      {helper && !error && <small className="input-helper">{helper}</small>}

      {error && <small className="input-error-text">{error}</small>}
    </div>
  );
}

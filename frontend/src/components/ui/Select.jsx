import "./select.css";

export default function Select({
  label,
  helper,
  error,
  options = [],
  fullWidth = true,
  placeholder = "-- Seleccionar --",
  ...props
}) {
  return (
    <div className={`select-group ${fullWidth ? "select-full" : ""}`}>
      {label && <label className="select-label">{label}</label>}

      <select className={`select ${error ? "select-error" : ""}`} {...props}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {helper && !error && <small className="select-helper">{helper}</small>}

      {error && <small className="select-error-text">{error}</small>}
    </div>
  );
}

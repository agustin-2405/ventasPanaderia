import "./button.css";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        btn
        btn-${variant}
        btn-${size}
        ${fullWidth ? "btn-full" : ""}
      `}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          Cargando...
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
}

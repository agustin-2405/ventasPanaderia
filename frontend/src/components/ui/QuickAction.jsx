import "./quickAction.css";

export default function QuickAction({
  titulo,
  descripcion,
  icon: Icon,
  onClick,
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      {Icon && (
        <div className="quick-action__icon">
          <Icon size={26} />
        </div>
      )}

      <div className="quick-action__content">
        <span className="quick-action__title">{titulo}</span>

        {descripcion && (
          <small className="quick-action__description">{descripcion}</small>
        )}
      </div>
    </button>
  );
}

import Card from "./Card";
import "./statCard.css";

export default function StatCard({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  color = "var(--color-primary)",
}) {
  return (
    <Card>
      <div className="stat-card">
        <div className="stat-card__icon" style={{ backgroundColor: color }}>
          {Icon && <Icon size={26} color="white" />}
        </div>

        <div className="stat-card__content">
          <p className="stat-card__title">{titulo}</p>

          <h2 className="stat-card__value">{valor}</h2>

          {descripcion && (
            <p className="stat-card__description">{descripcion}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

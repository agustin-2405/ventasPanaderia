import "./card.css";

export default function Card({
  titulo,
  subtitulo,
  actions,
  children,
  className = "",
  style = {},
}) {
  return (
    <section className={`card ${className}`} style={style}>
      {(titulo || subtitulo || actions) && (
        <div className="card-header">
          <div>
            {titulo && <h2 className="card-title">{titulo}</h2>}

            {subtitulo && <p className="card-subtitle">{subtitulo}</p>}
          </div>

          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}

      <div className="card-body">{children}</div>
    </section>
  );
}

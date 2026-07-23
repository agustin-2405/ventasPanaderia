import "./section.css";

export default function Section({ titulo, subtitulo, actions, children }) {
  return (
    <section className="section">
      {(titulo || subtitulo || actions) && (
        <header className="section-header">
          <div>
            {titulo && <h2 className="section-title">{titulo}</h2>}

            {subtitulo && <p className="section-subtitle">{subtitulo}</p>}
          </div>

          {actions && <div className="section-actions">{actions}</div>}
        </header>
      )}

      <div className="section-content">{children}</div>
    </section>
  );
}

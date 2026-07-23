import "./page.css";

export default function Page({ titulo, descripcion, actions, children }) {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">{titulo}</h1>

          {descripcion && <p className="page-description">{descripcion}</p>}
        </div>

        {actions && <div className="page-actions">{actions}</div>}
      </header>

      <section className="page-content">{children}</section>
    </main>
  );
}

import "../../styles/header.css";

export default function Header() {
  const fecha = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1 className="app-title">Sistema de Gestión</h1>
      </div>

      <div className="app-header-right">
        <span className="app-date">{fecha}</span>
      </div>
    </header>
  );
}

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div style={estilos.app}>
      <Sidebar />

      <main style={estilos.main}>
        <Header />

        <div style={estilos.contenido}>{children}</div>
      </main>
    </div>
  );
}

const estilos = {
  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--color-bg)",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  contenido: {
    flex: 1,
    overflowY: "auto",
  },
};

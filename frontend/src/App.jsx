import { useEffect, useState } from "react";

import Sidebar from "./components/layout/Sidebar";

import Inicio from "./pantallas/inicio";
import AltaProductos from "./pantallas/altaProducto";
import GestionPrecios from "./pantallas/gestionPrecios";
import SeccionRepartidores from "./pantallas/seccionRepartidores";
import HistorialPlanillas from "./pantallas/historialPlanilla";
import PlanillaReparto from "./pantallas/planillaReparto";

import "./styles/layout.css";

const RUTAS = {
  "#inicio": <Inicio />,
  "#productos": <AltaProductos />,
  "#precios": <GestionPrecios />,
  "#repartidores": <SeccionRepartidores />,
  "#historial": <HistorialPlanillas />,
  "#reparto": <PlanillaReparto />,
};

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || "#inicio");

  useEffect(() => {
    const manejarCambioRuta = () => {
      setRuta(window.location.hash || "#inicio");
    };

    window.addEventListener("hashchange", manejarCambioRuta);

    return () => window.removeEventListener("hashchange", manejarCambioRuta);
  }, []);

  return (
    <div className="app">
      <Sidebar rutaActual={ruta} />

      <main className="app-main">{RUTAS[ruta] ?? <Inicio />}</main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { exito, error } from "../servicios/notificaciones";
import Page from "../components/ui/Page";
import { listarProductos } from "../servicios/productosApi";
import { listarRepartidores } from "../servicios/repartidoresApi";
import { obtenerHistorial } from "../servicios/planillasApi";
import HistorialToolbar from "../components/historial/HistorialToolbar";
import HistorialCard from "../components/historial/HistorialCard";

export default function HistorialPlanillas() {
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState("");
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      const [reps, prods] = await Promise.all([
        listarRepartidores(),
        listarProductos(),
      ]);

      setRepartidores(reps);
      setProductos(prods);
    } catch (err) {
      error("Error al cargar datos", err.message);
    }
  };

  const buscarHistorial = async (id) => {
    setRepartidorSeleccionado(id);

    if (!id) {
      setHistorial([]);
      return;
    }

    setCargando(true);

    try {
      const data = await obtenerHistorial(id);

      setHistorial(data);

      if (data.length > 0) {
        exito("Historial cargado", `Se encontraron ${data.length} planillas.`);
      }
    } catch (err) {
      error("Error al cargar historial", err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Page
      titulo="Historial de Planillas"
      descripcion="Consulta el historial de ventas por repartidor."
    >
      <HistorialToolbar
        repartidores={repartidores}
        repartidorSeleccionado={repartidorSeleccionado}
        buscarHistorial={buscarHistorial}
      />

      {cargando && <p>Cargando historial...</p>}

      <div style={estilos.lista}>
        {historial.length === 0 && !cargando && (
          <p style={{ color: "#999" }}>
            No se encontraron planillas para este repartidor.
          </p>
        )}

        {historial.map((planilla) => (
          <HistorialCard
            key={planilla.id}
            planilla={planilla}
            productos={productos}
          />
        ))}
      </div>
    </Page>
  );
}

const estilos = {
  lista: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
};

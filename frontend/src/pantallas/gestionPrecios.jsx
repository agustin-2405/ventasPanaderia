import React, { useState, useEffect } from "react";
import { exito, error } from "../servicios/notificaciones";
import Page from "../components/ui/Page";
import { listarProductos } from "../servicios/productosApi";
import { listarRepartidores } from "../servicios/repartidoresApi";
import {
  obtenerPreciosEspeciales,
  guardarPreciosEspeciales,
} from "../servicios/planillasApi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import PreciosTable from "../components/precios/PreciosTable";

export default function GestionPrecios() {
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidorId, setRepartidorId] = useState("");
  const [preciosEditados, setPreciosEditados] = useState({});

  // Cargar repartidores y productos
  useEffect(() => {
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

    cargarDatos();
  }, []);

  // Obtener precios del repartidor seleccionado
  useEffect(() => {
    if (!repartidorId) {
      setPreciosEditados({});
      return;
    }

    const cargarPrecios = async () => {
      try {
        const datos = await obtenerPreciosEspeciales(repartidorId);

        setPreciosEditados(datos);
      } catch (err) {
        error("Error", err.message);
      }
    };

    cargarPrecios();
  }, [repartidorId]);

  // Guardar lista
  const guardarLista = async () => {
    if (!repartidorId) {
      error(
        "Repartidor no seleccionado",
        "Seleccioná un repartidor antes de guardar.",
      );

      return;
    }

    try {
      await guardarPreciosEspeciales({
        repartidorId,

        listaPrecios: preciosEditados,
      });

      exito(
        "Lista guardada",

        "Los precios fueron actualizados correctamente.",
      );
    } catch (err) {
      error(
        "Error al guardar",

        err.message,
      );
    }
  };

  return (
    <Page
      titulo="Gestión de Precios"
      descripcion="Administra los precios especiales por repartidor."
    >
      <Card
        titulo="Listas de precios"
        subtitulo="Cada repartidor puede tener una lista distinta."
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <Select
              label="Repartidor"
              value={repartidorId}
              onChange={(e) => setRepartidorId(e.target.value)}
              options={repartidores.map((r) => ({
                value: r.id,
                label: r.nombre,
              }))}
            />
          </div>

          <Button
            variant="secondary"
            onClick={() => (window.location.hash = "#reparto")}
          >
            Volver
          </Button>
        </div>
      </Card>

      {repartidorId && (
        <>
          <PreciosTable
            productos={productos}
            preciosEditados={preciosEditados}
            setPreciosEditados={setPreciosEditados}
          />

          <Button
  variant="success"
  onClick={guardarLista}
>
  Guardar Lista de Precios
</Button>
        </>
      )}
    </Page>
  );
}

const estilos = {
  contenedor: {
    padding: "20px",
    fontFamily: "Arial",
  },

  select: {
    padding: "8px",
    marginLeft: "10px",
  },

  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  encabezado: {
    backgroundColor: "#f4f4f4",
    textAlign: "left",
  },

  celda: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },

  input: {
    width: "90px",
    padding: "5px",
  },

  boton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  botonVolver: {
    padding: "8px 15px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

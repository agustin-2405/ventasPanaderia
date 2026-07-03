import React, { useState, useEffect } from "react";
import { exito, error } from "../servicios/notificaciones";

export default function GestionPrecios() {
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidorId, setRepartidorId] = useState("");
  const [preciosEditados, setPreciosEditados] = useState({});

  // Cargar repartidores y productos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resRep, resProd] = await Promise.all([
          fetch("http://localhost:4000/api/repartidores"),
          fetch("http://localhost:4000/api/productos"),
        ]);

        if (!resRep.ok || !resProd.ok) {
          throw new Error("No se pudieron cargar los datos.");
        }

        setRepartidores(await resRep.json());
        setProductos(await resProd.json());
      } catch (err) {
        error(
          "Error al cargar datos",
          err.message
        );
      }
    };

    cargarDatos();
  }, []);

  // Obtener precios del repartidor seleccionado
  useEffect(() => {
    if (!repartidorId) return;

    const cargarPrecios = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:4000/api/repartos/precios/${repartidorId}`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener la lista de precios.");
        }

        const datos = await respuesta.json();
        setPreciosEditados(datos);
      } catch (err) {
        error(
          "Error",
          err.message
        );
      }
    };

    cargarPrecios();
  }, [repartidorId]);

  // Guardar lista
  const guardarLista = async () => {
    if (!repartidorId) {
      error(
        "Repartidor no seleccionado",
        "Seleccioná un repartidor antes de guardar."
      );
      return;
    }

    try {
      const respuesta = await fetch(
        "http://localhost:4000/api/repartos/precios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repartidorId,
            listaPrecios: preciosEditados,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudieron guardar los precios.");
      }

      exito(
        "Lista guardada",
        "Los precios fueron actualizados correctamente."
      );
    } catch (err) {
      error(
        "Error al guardar",
        err.message
      );
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Listas de Precios por Repartidor
        </h2>

        <button
          onClick={() => (window.location.hash = "#reparto")}
          style={estilos.botonVolver}
        >
          ⬅ Volver a Planilla
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Seleccionar Repartidor:</label>

        <select
          value={repartidorId}
          onChange={(e) => setRepartidorId(e.target.value)}
          style={estilos.select}
        >
          <option value="">-- Seleccione --</option>

          {repartidores.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      {repartidorId && (
        <>
          <table style={estilos.tabla}>
            <thead>
              <tr style={estilos.encabezado}>
                <th>Producto</th>
                <th>Precio General</th>
                <th>Precio Especial</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td style={estilos.celda}>{p.nombre}</td>

                  <td style={estilos.celda}>
                    ${Number(p.precio).toFixed(2)}
                  </td>

                  <td style={estilos.celda}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={p.precio}
                      value={preciosEditados[p.id] ?? ""}
                      onChange={(e) =>
                        setPreciosEditados({
                          ...preciosEditados,
                          [p.id]:
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value),
                        })
                      }
                      style={estilos.input}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={guardarLista}
            style={estilos.boton}
          >
            Guardar Lista de Precios
          </button>
        </>
      )}
    </div>
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
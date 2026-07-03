import React, { useState, useEffect } from "react";
import { exito, error } from "../servicios/notificaciones";

export default function HistorialPlanillas() {
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState("");
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);

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
        error("Error al cargar datos", err.message);
      }
    };

    cargarDatos();
  }, []);

  const buscarHistorial = async (id) => {
    setRepartidorSeleccionado(id);
    if (!id) return setHistorial([]);

    setCargando(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/repartos/historial/${id}`,
      );
      const data = await res.json();
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
    <div style={estilos.contenedor}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Historial de Ventas por Repartidor</h2>
        <button
          onClick={() => (window.location.hash = "#")}
          style={estilos.botonLink}
        >
          ⬅ Volver
        </button>
      </div>

      <div style={estilos.selector}>
        <label>Seleccionar Repartidor: </label>
        <select
          value={repartidorSeleccionado}
          onChange={(e) => buscarHistorial(e.target.value)}
          style={estilos.select}
        >
          <option value="">-- Seleccionar --</option>
          {repartidores.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p>Cargando historial...</p>}

      <div style={estilos.lista}>
        {historial.length === 0 && !cargando && (
          <p style={{ color: "#999" }}>
            No se encontraron planillas para este repartidor.
          </p>
        )}

        {historial.map((planilla) => {
          // Normalizamos la fuente de datos de productos
          const items = Array.isArray(planilla.productos)
            ? planilla.productos
            : Array.isArray(planilla.items)
              ? planilla.items
              : [];
          const totalDinero = items.reduce((total, item) => {
            const idBuscado = item.productoId || item.producto_id;
            const producto = productos.find((prod) => prod.id == idBuscado);
            const precio = producto ? producto.precio : 0;
            const llevado = item.cantidadLlevada ?? item.cantidad ?? 0;
            const devuelto = item.cantidadDevuelta ?? 0;
            const vendido = Math.max(0, llevado - devuelto);
            const subtotal = vendido * precio;
            return total + subtotal;
          }, 0);

          return (
            <div key={planilla.id} style={estilos.card}>
              <div style={estilos.cardHeader}>
                <strong>
                  Fecha: {new Date(planilla.fecha).toLocaleDateString()}
                </strong>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      ...estilos.tag,
                      backgroundColor:
                        planilla.estado === "CERRADA" ? "#27ae60" : "#f39c12",
                    }}
                  >
                    {planilla.estado}
                  </span>
                  {planilla.estado !== "CERRADA" && (
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "planilla_a_cargar",
                          JSON.stringify(planilla),
                        );
                        window.location.hash = "#";
                      }}
                      style={estilos.botonAccion}
                    >
                      Modificar / Cerrar
                    </button>
                  )}
                </div>
              </div>
              <div style={estilos.cardBody}>
                <table style={estilos.miniTabla}>
                  <thead>
                    <tr>
                      <th style={estilos.th}>Producto</th>
                      <th style={estilos.th}>Llevó</th>
                      <th style={estilos.th}>Devolvió</th>
                      <th style={estilos.th}>Vendido</th>
                      <th style={estilos.th}>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const idBuscado = item.productoId || item.producto_id;
                      const p = productos.find((prod) => prod.id == idBuscado);
                      const nombre = p ? p.nombre : `Producto #${idBuscado}`;
                      const precio = p ? p.precio : 0;

                      const llevado =
                        item.cantidadLlevada ?? item.cantidad ?? 0;
                      const devuelto = item.cantidadDevuelta || 0;
                      const vendido = Math.max(0, llevado - devuelto);
                      const subtotal = vendido * precio;

                      return (
                        <tr key={idx}>
                          <td style={estilos.td}>{nombre}</td>
                          <td style={estilos.td}>
                            {Number(llevado).toFixed(1)}
                          </td>
                          <td style={estilos.td}>
                            {Number(devuelto).toFixed(1)}
                          </td>
                          <td style={{ ...estilos.td, fontWeight: "bold" }}>
                            {Number(vendido).toFixed(1)}
                          </td>
                          <td style={estilos.td}>${subtotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          ...estilos.td,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        TOTAL:
                      </td>
                      <td
                        style={{
                          ...estilos.td,
                          fontWeight: "bold",
                          color: "#27ae60",
                        }}
                      >
                        ${totalDinero.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    maxWidth: "800px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  selector: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  select: { padding: "8px", marginLeft: "10px" },
  lista: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "white",
  },
  cardHeader: {
    padding: "10px 15px",
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBody: { padding: "15px" },
  tag: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  botonAccion: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  miniTabla: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: { textAlign: "left", borderBottom: "2px solid #eee", padding: "8px" },
  td: { padding: "8px", borderBottom: "1px solid #eee" },
  botonLink: {
    background: "none",
    border: "1px solid #ccc",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

import "./planillaTable.css";
import { useMemo, useState } from "react";
import Card from "../ui/Card";
import PlanillaRow from "./PlanillaRow";
import PlanillaCard from "./PlanillaCard";

export default function PlanillaTable({
  productos,
  fase,
  cantidadesLlevadas,
  cantidadesDevueltas,
  preciosRepartidor,
  ajustes,
  manejarCambioCantidad,
  setAjustes,
  aplicarAjuste,
  setFase,
}) {
  const totalRecaudado = productos.reduce((acc, producto) => {
    const llevado = Number(cantidadesLlevadas[producto.id] || 0);
    const devuelto = Number(cantidadesDevueltas[producto.id] || 0);

    const vendido = Math.max(0, llevado - devuelto);

    const precio =
      Number(preciosRepartidor[producto.id]) || Number(producto.precio) || 0;

    return acc + vendido * precio;
  }, 0);

  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = useMemo(() => {
    return [...productos]
      .filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      )
      .sort((a, b) => {
        const aCargado =
          Number(cantidadesLlevadas[a.id] || 0) +
            Number(cantidadesDevueltas[a.id] || 0) >
          0;

        const bCargado =
          Number(cantidadesLlevadas[b.id] || 0) +
            Number(cantidadesDevueltas[b.id] || 0) >
          0;

        if (aCargado === bCargado) {
          return a.nombre.localeCompare(b.nombre);
        }

        return bCargado - aCargado;
      });
  }, [productos, busqueda, cantidadesLlevadas, cantidadesDevueltas]);

  return (
    <Card
      titulo="Detalle de la mercadería"
      subtitulo="Control de salida y devolución de productos."
    >
      {/* =======================
          ESCRITORIO
      ======================= */}
      <div className="planilla-buscador">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="planilla-input-buscador"
        />

        {busqueda && (
          <button className="planilla-limpiar" onClick={() => setBusqueda("")}>
            ✕
          </button>
        )}

        <span className="planilla-contador">
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </span>
      </div>
      <div className="planilla-desktop">
        <div className="planilla-table-container">
          <table className="planilla-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Se Lleva</th>
                <th>Devuelve</th>
                <th>Vendido</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => (
                <PlanillaRow
                  key={producto.id}
                  producto={producto}
                  fase={fase}
                  cantidadesLlevadas={cantidadesLlevadas}
                  cantidadesDevueltas={cantidadesDevueltas}
                  preciosRepartidor={preciosRepartidor}
                  ajustes={ajustes}
                  manejarCambioCantidad={manejarCambioCantidad}
                  setAjustes={setAjustes}
                  aplicarAjuste={aplicarAjuste}
                  setFase={setFase}
                />
              ))}
            </tbody>

            {fase === "RETORNO" && (
              <tfoot>
                <tr className="planilla-total">
                  <td colSpan={4} className="planilla-total-label">
                    TOTAL RECAUDADO
                  </td>

                  <td colSpan={2} className="planilla-total-value">
                    ${totalRecaudado.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* =======================
          CELULAR
      ======================= */}

      <div className="planilla-mobile">
        {productosFiltrados.map((producto) => (
          <PlanillaCard
            key={producto.id}
            producto={producto}
            fase={fase}
            cantidadesLlevadas={cantidadesLlevadas}
            cantidadesDevueltas={cantidadesDevueltas}
            preciosRepartidor={preciosRepartidor}
            ajustes={ajustes}
            manejarCambioCantidad={manejarCambioCantidad}
            setAjustes={setAjustes}
            aplicarAjuste={aplicarAjuste}
            setFase={setFase}
          />
        ))}

        {fase === "RETORNO" && (
          <div className="planilla-total-mobile">
            <span>Total recaudado</span>

            <strong>${totalRecaudado.toLocaleString()}</strong>
          </div>
        )}
      </div>
    </Card>
  );
}

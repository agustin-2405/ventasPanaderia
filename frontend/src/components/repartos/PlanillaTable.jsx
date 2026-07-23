import "./planillaTable.css";

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

  return (
    <Card
      titulo="Detalle de la mercadería"
      subtitulo="Control de salida y devolución de productos."
    >
      {/* =======================
          ESCRITORIO
      ======================= */}

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
              {productos.map((producto) => (
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
        {productos.map((producto) => (
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

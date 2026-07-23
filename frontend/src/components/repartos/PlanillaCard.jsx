import "./planillaCard.css";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PlanillaCard({
  producto,
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
  const llevado = cantidadesLlevadas[producto.id] || 0;
  const devuelto = cantidadesDevueltas[producto.id] || 0;

  const vendido = fase === "RETORNO" ? Math.max(0, llevado - devuelto) : 0;

  const precioEspecial = preciosRepartidor[String(producto.id)];

  const precio =
    precioEspecial !== undefined
      ? Number(precioEspecial)
      : Number(producto.precio);

  const subtotal = vendido * precio;

  return (
    <div className="planilla-card">
      <div className="planilla-card-header">
        <div>
          <h3>{producto.nombre}</h3>

          <span className="planilla-card-price">
            ${precio}
            {preciosRepartidor[producto.id] && " ⭐"}
          </span>
        </div>
      </div>

      <div className="planilla-card-section">
        <label>Se lleva</label>

        <Input
          type="number"
          min={0}
          step={0.5}
          value={llevado}
          onChange={(e) =>
            manejarCambioCantidad(producto.id, e.target.value, "llevada")
          }
        />
      </div>

      <div className="planilla-card-section">
        <label>Ajuste</label>

        <div className="planilla-card-ajuste">
          <Input
            type="number"
            min={0}
            step={0.5}
            placeholder="0"
            value={ajustes[producto.id] || ""}
            onChange={(e) =>
              setAjustes((prev) => ({
                ...prev,
                [producto.id]: e.target.value,
              }))
            }
          />

          <Button
            variant="success"
            onClick={() => aplicarAjuste(producto.id, "sumar")}
          >
            +
          </Button>

          <Button
            variant="danger"
            onClick={() => aplicarAjuste(producto.id, "restar")}
          >
            -
          </Button>
        </div>
      </div>

      <div className="planilla-card-section">
        <label>Devuelve</label>

        <Input
          type="number"
          min={0}
          step={0.5}
          placeholder="0"
          value={devuelto}
          onFocus={() => setFase("RETORNO")}
          onChange={(e) =>
            manejarCambioCantidad(producto.id, e.target.value, "retorno")
          }
        />
      </div>

      {fase === "RETORNO" && (
        <div className="planilla-card-footer">
          <div>
            <span>Vendido</span>

            <strong>{vendido} u.</strong>
          </div>

          <div>
            <span>Subtotal</span>

            <strong className="planilla-card-total">
              ${subtotal.toLocaleString()}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

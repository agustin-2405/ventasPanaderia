import "./planillaRow.css";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PlanillaRow({
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
    <tr>
      <td>
        <strong>{producto.nombre}</strong>
      </td>

      <td>
        ${precio}
        {preciosRepartidor[producto.id] && " ⭐"}
      </td>

      <td>
        <div className="planilla-llevada">
          <div className="planilla-input-grande">
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

          <div className="planilla-ajustes">
            <div className="planilla-input-chico">
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
            </div>

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
      </td>

      <td>
        <div className="planilla-input-grande">
          <Input
            type="number"
            min={0}
            step={0.5}
            value={devuelto}
            placeholder="0"
            onFocus={() => setFase("RETORNO")}
            onChange={(e) =>
              manejarCambioCantidad(producto.id, e.target.value, "retorno")
            }
          />
        </div>
      </td>

      <td className="planilla-vendido">
        {fase === "RETORNO" ? `${vendido} u.` : "-"}
      </td>

      <td className="planilla-subtotal">
        {fase === "RETORNO" ? `$${subtotal.toLocaleString()}` : "-"}
      </td>
    </tr>
  );
}

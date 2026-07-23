import "./planillaResumen.css";

import Card from "../ui/Card";

export default function PlanillaResumen({
  productos,
  cantidadesLlevadas,
  cantidadesDevueltas,
  preciosRepartidor,
  fase,
}) {
  let totalLlevado = 0;
  let totalDevuelto = 0;
  let totalVendido = 0;
  let totalImporte = 0;

  productos.forEach((producto) => {
    const llevado = Number(cantidadesLlevadas[producto.id] || 0);
    const devuelto = Number(cantidadesDevueltas[producto.id] || 0);

    const vendido = Math.max(0, llevado - devuelto);

    const precio = preciosRepartidor?.[producto.id] ?? Number(producto.precio);

    totalLlevado += llevado;
    totalDevuelto += devuelto;
    totalVendido += vendido;
    totalImporte += vendido * precio;
  });

  return (
    <Card
      titulo="Resumen de la planilla"
      subtitulo="Información general del reparto."
    >
      <div className="planilla-resumen-grid">
        <Item titulo="Productos llevados" valor={`${totalLlevado} u.`} />

        <Item titulo="Productos devueltos" valor={`${totalDevuelto} u.`} />

        <Item
          titulo="Productos vendidos"
          valor={`${totalVendido} u.`}
          color="verde"
        />

        <Item
          titulo="Importe total"
          valor={fase === "RETORNO" ? `$${totalImporte.toLocaleString()}` : "-"}
          color="azul"
        />
      </div>
    </Card>
  );
}

function Item({ titulo, valor, color = "" }) {
  return (
    <div className="planilla-resumen-item">
      <span className="planilla-resumen-titulo">{titulo}</span>

      <strong className={`planilla-resumen-valor ${color}`}>{valor}</strong>
    </div>
  );
}

export default function HistorialTable({ items, productos, totalDinero }) {
  return (
    <div style={estilos.contenedor}>
      <table style={estilos.tabla}>
        <colgroup>
          <col style={{ width: "48%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "16%" }} />
        </colgroup>

        <thead>
          <tr>
            <th style={{ ...estilos.th, textAlign: "left" }}>Producto</th>

            <th style={estilos.thNumero}>Llevó</th>

            <th style={estilos.thNumero}>Devolvió</th>

            <th style={estilos.thNumero}>Vendido</th>

            <th style={estilos.thImporte}>Importe</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const id = item.productoId || item.producto_id;

            const producto = productos.find((p) => p.id == id);

            const nombre = producto ? producto.nombre : `Producto ${id}`;

            const precio = Number(producto?.precio || 0);

            const llevado = Number(item.cantidadLlevada ?? item.cantidad ?? 0);

            const devuelto = Number(item.cantidadDevuelta ?? 0);

            const vendido = Math.max(0, llevado - devuelto);

            return (
              <tr key={index}>
                <td style={estilos.producto}>{nombre}</td>

                <td style={estilos.numero}>{llevado}</td>

                <td style={estilos.numero}>{devuelto}</td>

                <td style={estilos.numero}>
                  <strong>{vendido}</strong>
                </td>

                <td style={estilos.importe}>
                  $
                  {(vendido * precio).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4} style={estilos.totalTexto}>
              TOTAL RECAUDADO
            </td>

            <td style={estilos.totalImporte}>
              $
              {totalDinero.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const estilos = {
  contenedor: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },

  tabla: {
    width: "100%",
    minWidth: 700,
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 12px",
    borderBottom: "2px solid #E5E7EB",
    color: "#374151",
    fontWeight: 700,
    fontSize: 15,
  },

  thNumero: {
    padding: "14px 12px",
    textAlign: "center",
    borderBottom: "2px solid #E5E7EB",
    color: "#374151",
    fontWeight: 700,
    fontSize: 15,
  },

  thImporte: {
    padding: "14px 12px",
    textAlign: "right",
    borderBottom: "2px solid #E5E7EB",
    color: "#374151",
    fontWeight: 700,
    fontSize: 15,
  },

  producto: {
    padding: "12px",
    borderBottom: "1px solid #F3F4F6",
    textAlign: "left",
  },

  numero: {
    padding: "12px",
    borderBottom: "1px solid #F3F4F6",
    textAlign: "center",
  },

  importe: {
    padding: "12px",
    borderBottom: "1px solid #F3F4F6",
    textAlign: "right",
    fontWeight: 500,
  },

  totalTexto: {
    padding: "18px 12px",
    textAlign: "right",
    fontWeight: 700,
    borderTop: "2px solid #E5E7EB",
    fontSize: 16,
  },

  totalImporte: {
    padding: "18px 12px",
    textAlign: "right",
    fontWeight: 700,
    color: "#16A34A",
    borderTop: "2px solid #E5E7EB",
    fontSize: 18,
  },
};

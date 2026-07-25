export default function HistorialMobile({ items, productos, totalDinero }) {
  return (
    <div style={estilos.contenedor}>
      {items.map((item, index) => {
        const id = item.productoId || item.producto_id;

        const producto = productos.find((p) => p.id == id);

        const nombre = producto ? producto.nombre : `Producto ${id}`;

        const precio = Number(
          item.precioUnitario ?? item.precio_unitario ?? producto?.precio ?? 0,
        );

        const llevado = Number(item.cantidadLlevada ?? item.cantidad ?? 0);

        const devuelto = Number(item.cantidadDevuelta ?? 0);

        const vendido = Math.max(0, llevado - devuelto);

        const importe = vendido * precio;

        return (
          <div key={index} style={estilos.producto}>
            <div style={estilos.nombre}>{nombre}</div>

            <div style={estilos.fila}>
              <span>Llevó</span>
              <strong>{llevado}</strong>
            </div>

            <div style={estilos.fila}>
              <span>Devueltas</span>

              <strong style={estilos.rojo}>{devuelto}</strong>
            </div>

            <div style={estilos.fila}>
              <span>Vendidas</span>

              <strong style={estilos.verde}>{vendido}</strong>
            </div>

            <div style={estilos.divisor} />

            <div style={estilos.fila}>
              <span>Precio unitario</span>

              <strong>${precio.toLocaleString("es-AR")}</strong>
            </div>

            <div style={estilos.filaImporte}>
              <span>Importe</span>

              <strong>${importe.toLocaleString("es-AR")}</strong>
            </div>
          </div>
        );
      })}

      <div style={estilos.total}>
        <div style={estilos.totalTitulo}>TOTAL RECAUDADO</div>

        <div style={estilos.totalImporte}>
          ${totalDinero.toLocaleString("es-AR")}
        </div>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 18,
  },

  producto: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: 18,
  },

  nombre: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 18,
    color: "#111827",
  },

  fila: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: 16,
  },

  filaImporte: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 10,
    borderTop: "1px solid #E5E7EB",
    fontWeight: 700,
    fontSize: 18,
    color: "#16A34A",
  },

  divisor: {
    height: 1,
    background: "#E5E7EB",
    margin: "10px 0",
  },

  rojo: {
    color: "#DC2626",
  },

  verde: {
    color: "#16A34A",
  },

  total: {
    background: "#ECFDF5",
    border: "1px solid #BBF7D0",
    borderRadius: 16,
    padding: 22,
    marginTop: 4,
  },

  totalTitulo: {
    color: "#166534",
    fontWeight: 700,
    fontSize: 15,
  },

  totalImporte: {
    marginTop: 10,
    color: "#16A34A",
    fontWeight: 800,
    fontSize: 30,
  },
};

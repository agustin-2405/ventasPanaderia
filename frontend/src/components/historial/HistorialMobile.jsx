export default function HistorialMobile({ items, productos, totalDinero }) {
  return (
    <div style={estilos.lista}>
      {items.map((item) => {
        const id = item.productoId || item.producto_id;

        const producto = productos.find((p) => p.id == id);

        const nombre = producto?.nombre ?? `Producto ${id}`;

        const precio = Number(
          item.precioUnitario ?? item.precio_unitario ?? producto?.precio ?? 0,
        );

        const llevado = Number(item.cantidadLlevada ?? item.cantidad ?? 0);

        const devuelto = Number(item.cantidadDevuelta ?? 0);

        const vendido = Math.max(0, llevado - devuelto);

        const importe = vendido * precio;

        return (
          <div key={item.id ?? id} style={estilos.card}>
            <div style={estilos.nombre}>{nombre}</div>

            <div style={estilos.metricas}>
              <div style={estilos.metrica}>
                <div style={estilos.numero}>{llevado}</div>
                <div style={estilos.label}>Llevó</div>
              </div>

              <div style={estilos.metrica}>
                <div
                  style={{
                    ...estilos.numero,
                    color: "#DC2626",
                  }}
                >
                  {devuelto}
                </div>
                <div style={estilos.label}>Dev.</div>
              </div>

              <div style={estilos.metrica}>
                <div
                  style={{
                    ...estilos.numero,
                    color: "#16A34A",
                  }}
                >
                  {vendido}
                </div>
                <div style={estilos.label}>Vend.</div>
              </div>
            </div>

            <div style={estilos.divisor} />

            <div style={estilos.info}>
              <span>Precio unitario</span>

              <strong>${precio.toLocaleString("es-AR")}</strong>
            </div>

            <div style={estilos.totalProducto}>
              <span>Importe</span>

              <strong>${importe.toLocaleString("es-AR")}</strong>
            </div>
          </div>
        );
      })}

      <div style={estilos.total}>
        <div style={estilos.totalLabel}>TOTAL RECAUDADO</div>

        <div style={estilos.totalValor}>
          ${totalDinero.toLocaleString("es-AR")}
        </div>
      </div>
    </div>
  );
}

const estilos = {
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: 14,
  },

  nombre: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 14,
  },

  metricas: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },

  metrica: {
    flex: 1,
    textAlign: "center",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "10px 6px",
  },

  numero: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },

  label: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  divisor: {
    height: 1,
    background: "#E5E7EB",
    marginBottom: 12,
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 15,
    marginBottom: 8,
  },

  totalProducto: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#16A34A",
  },

  total: {
    marginTop: 8,
    background: "#ECFDF5",
    border: "1px solid #BBF7D0",
    borderRadius: 14,
    padding: 16,
  },

  totalLabel: {
    color: "#166534",
    fontWeight: 600,
    fontSize: 14,
  },

  totalValor: {
    marginTop: 6,
    color: "#16A34A",
    fontSize: 28,
    fontWeight: 800,
  },
};

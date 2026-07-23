import Card from "../ui/Card";
import Button from "../ui/Button";
import HistorialTable from "./HistorialTable";

export default function HistorialCard({ planilla, productos }) {
  const items = Array.isArray(planilla.productos)
    ? planilla.productos
    : Array.isArray(planilla.items)
      ? planilla.items
      : [];

  const totalDinero = items.reduce((total, item) => {
    const idBuscado = item.productoId || item.producto_id;

    const producto = productos.find((prod) => prod.id == idBuscado);

    const precio = producto ? Number(producto.precio) : 0;

    const llevado = Number(item.cantidadLlevada ?? item.cantidad ?? 0);

    const devuelto = Number(item.cantidadDevuelta ?? 0);

    const vendido = Math.max(0, llevado - devuelto);

    return total + vendido * precio;
  }, 0);

  return (
    <Card>
      <div style={estilos.header}>
        <div>
          <h3 style={estilos.fecha}>
            {new Date(planilla.fecha).toLocaleDateString("es-AR")}
          </h3>
        </div>

        <div style={estilos.acciones}>
          <span
            style={{
              ...estilos.badge,
              background: planilla.estado === "CERRADA" ? "#16A34A" : "#F59E0B",
            }}
          >
            {planilla.estado}
          </span>

          {planilla.estado !== "CERRADA" && (
            <Button
              size="small"
              onClick={() => {
                localStorage.setItem(
                  "planilla_a_cargar",
                  JSON.stringify(planilla),
                );

                window.location.hash = "#reparto";
              }}
            >
              Modificar
            </Button>
          )}
        </div>
      </div>

      <HistorialTable
        items={items}
        productos={productos}
        totalDinero={totalDinero}
      />
    </Card>
  );
}

const estilos = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },

  fecha: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1F2937",
  },

  acciones: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },

  badge: {
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
  },
};

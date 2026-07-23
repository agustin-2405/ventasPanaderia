import Card from "../ui/Card";
import PrecioRow from "./PrecioRow";

export default function PreciosTable({
  productos,
  preciosEditados,
  setPreciosEditados,
}) {
  return (
    <Card
      titulo="Lista de precios"
      subtitulo="Configurá precios especiales para este repartidor."
    >
      <table style={estilos.tabla}>
        <thead>
          <tr style={estilos.encabezado}>
            <th>Producto</th>
            <th>Precio General</th>
            <th>Precio Especial</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((producto) => (
            <PrecioRow
              key={producto.id}
              producto={producto}
              precioEspecial={preciosEditados[producto.id]}
              onChange={(id, valor) =>
                setPreciosEditados((prev) => ({
                  ...prev,
                  [id]: valor === "" ? "" : Number(valor),
                }))
              }
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const estilos = {
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
  },

  encabezado: {
    background: "#F8FAFC",
    textAlign: "left",
  },
};

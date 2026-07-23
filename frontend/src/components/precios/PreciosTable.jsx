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
      <div style={estilos.lista}>
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
      </div>
    </Card>
  );
}

const estilos = {
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
};

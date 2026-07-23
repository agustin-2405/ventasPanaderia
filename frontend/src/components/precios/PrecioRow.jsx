import Input from "../ui/Input";

export default function PrecioRow({ producto, precioEspecial, onChange }) {
  return (
    <div style={estilos.card}>
      <div style={estilos.header}>
        <h3 style={estilos.nombre}>{producto.nombre}</h3>
      </div>

      <div style={estilos.item}>
        <span style={estilos.label}>Precio General</span>

        <span style={estilos.valor}>
          $
          {Number(producto.precio).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      <div style={estilos.item}>
        <span style={estilos.label}>Precio Especial</span>

        <Input
          type="number"
          step="0.01"
          min={0}
          placeholder={producto.precio}
          value={precioEspecial ?? ""}
          onChange={(e) => onChange(producto.id, e.target.value)}
        />
      </div>
    </div>
  );
}

const estilos = {
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: "#fff",
  },

  header: {
    marginBottom: 14,
  },

  nombre: {
    margin: 0,
    fontSize: 18,
    color: "#111827",
  },

  item: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 14,
  },

  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: 600,
  },

  valor: {
    fontSize: 18,
    fontWeight: 700,
  },
};

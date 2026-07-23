import Input from "../ui/Input";

export default function PrecioRow({ producto, precioEspecial, onChange }) {
  return (
    <tr>
      <td style={estilos.celda}>{producto.nombre}</td>

      <td style={estilos.celda}>${Number(producto.precio).toFixed(2)}</td>

      <td style={estilos.celda}>
        <div style={{ width: 120 }}>
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder={producto.precio}
            value={precioEspecial ?? ""}
            onChange={(e) => onChange(producto.id, e.target.value)}
          />
        </div>
      </td>
    </tr>
  );
}

const estilos = {
  celda: {
    padding: "12px",
    borderBottom: "1px solid #E5E7EB",
  },
};

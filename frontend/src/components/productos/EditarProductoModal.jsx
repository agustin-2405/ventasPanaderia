import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function EditarProductoModal({
  abierto,
  producto,
  nombre,
  setNombre,
  precio,
  setPrecio,
  onGuardar,
  onCancelar,
}) {
  if (!abierto || !producto) return null;

  return (
    <div style={estilos.overlay}>
      <Card
        titulo="Editar producto"
        subtitulo="Modificá el nombre y el precio."
      >
        <div style={estilos.formulario}>
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            label="Precio"
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div style={estilos.botones}>
          <Button variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>

          <Button variant="success" onClick={onGuardar}>
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  );
}

const estilos = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  formulario: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  botones: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
  },
};

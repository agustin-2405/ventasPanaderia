import Card from "../ui/Card";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function HistorialToolbar({
  repartidores,
  repartidorSeleccionado,
  buscarHistorial,
}) {
  return (
    <Card
      titulo="Buscar planillas"
      subtitulo="Seleccioná un repartidor para consultar su historial."
    >
      <div style={estilos.toolbar}>
        <div style={{ flex: 1 }}>
          <Select
            label="Repartidor"
            value={repartidorSeleccionado}
            onChange={(e) => buscarHistorial(e.target.value)}
            options={repartidores.map((rep) => ({
              value: rep.id,
              label: rep.nombre,
            }))}
          />
        </div>

        <Button
          variant="secondary"
          onClick={() => (window.location.hash = "#reparto")}
        >
          Volver
        </Button>
      </div>
    </Card>
  );
}

const estilos = {
  toolbar: {
    display: "flex",
    gap: 20,
    alignItems: "flex-end",
  },
};

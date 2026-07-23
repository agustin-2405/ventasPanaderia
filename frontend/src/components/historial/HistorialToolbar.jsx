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
        <div style={estilos.select}>
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

        <div style={estilos.boton}>
          <Button
            variant="secondary"
            onClick={() => (window.location.hash = "#reparto")}
          >
            Volver
          </Button>
        </div>
      </div>
    </Card>
  );
}

const estilos = {
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-end",
  },

  select: {
    flex: "1 1 250px",
  },

  boton: {
    flex: "0 0 auto",
  },
};

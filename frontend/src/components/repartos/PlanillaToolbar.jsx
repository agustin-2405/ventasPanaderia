import Card from "../ui/Card";
import Button from "../ui/Button";
import Select from "../ui/Select";
import "./planillaToolbar.css";

export default function PlanillaToolbar({
  repartidores,
  repartidorSeleccionado,
  setRepartidorSeleccionado,
  fase,
  planillaCreadaId,
  abrirHistorial,
  abrirGestionPrecios,
}) {
  return (
    <Card
      titulo="Planilla de reparto"
      subtitulo="Seleccioná un repartidor para comenzar el reparto."
    >
      <div className="planilla-toolbar">
        <div className="planilla-selector">
          <Select
            label="Repartidor"
            value={repartidorSeleccionado}
            disabled={planillaCreadaId !== null}
            onChange={(e) => setRepartidorSeleccionado(e.target.value)}
            options={repartidores.map((rep) => ({
              value: rep.id,
              label: rep.nombre,
            }))}
          />
        </div>

        <div className="planilla-estado">
          <span className="planilla-estado-titulo">Estado</span>

          <span
            className={`planilla-badge ${
              fase === "SALIDA" ? "salida" : "retorno"
            }`}
          >
            {fase}
          </span>
        </div>

        <div className="planilla-toolbar-buttons">
          <Button variant="secondary" onClick={abrirHistorial}>
            Historial
          </Button>

          <Button variant="secondary" onClick={abrirGestionPrecios}>
            Precios
          </Button>
        </div>
      </div>
    </Card>
  );
}

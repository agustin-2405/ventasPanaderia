import { useState, useEffect } from "react";

import Page from "../components/ui/Page";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "./seccionRepartidores.css";

import { exito, error } from "../servicios/notificaciones";
import {
  listarRepartidores,
  crearRepartidor,
} from "../servicios/repartidoresApi";

export default function SeccionRepartidores() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [repartidores, setRepartidores] = useState([]);

  useEffect(() => {
    obtenerRepartidores();
  }, []);

  async function obtenerRepartidores() {
    try {
      const datos = await listarRepartidores();
      setRepartidores(datos);
    } catch (err) {
      error("Error al cargar repartidores", err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarEnvio(e) {
    e.preventDefault();

    if (!nombre.trim()) {
      error("Datos inválidos", "El nombre del repartidor es obligatorio.");
      return;
    }

    setGuardando(true);

    try {
      const datos = await crearRepartidor({
        nombre,
        telefono,
        vehiculo,
      });

      exito(
        "Repartidor registrado",
        `${datos.nombre} registrado correctamente.`,
      );

      setNombre("");
      setTelefono("");
      setVehiculo("");

      await obtenerRepartidores();
    } catch (err) {
      error("No se pudo registrar", err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Page
      titulo="Gestión de Repartidores"
      descripcion="Administrá el personal encargado de los repartos diarios."
    >
      <div className="repartidores-grid">
        <Card
          titulo="Nuevo repartidor"
          subtitulo="Registrá un nuevo repartidor."
        >
          <form onSubmit={manejarEnvio} className="repartidores-form">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <Input
              label="Teléfono"
              placeholder="2615555555"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <Input
              label="Vehículo"
              placeholder="Moto, Kangoo..."
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
            />

            <div className="repartidores-actions">
              <Button type="submit" disabled={guardando}>
                {guardando ? "Registrando..." : "Registrar repartidor"}
              </Button>
            </div>
          </form>
        </Card>

        <Card
          titulo="Personal activo"
          subtitulo={`${repartidores.length} repartidores registrados`}
        >
          {cargando ? (
            <p>Cargando...</p>
          ) : repartidores.length === 0 ? (
            <p>No hay repartidores registrados.</p>
          ) : (
            <div className="repartidores-lista">
              {repartidores.map((rep) => (
                <div key={rep.id} className="repartidor-card">
                  <div className="repartidor-avatar">👤</div>

                  <div>
                    <h4 className="repartidor-nombre">{rep.nombre}</h4>

                    <p className="repartidor-info">🚚 {rep.vehiculo || "A pie"}</p>

                    {rep.telefono && (
                      <p className="repartidor-info">📞 {rep.telefono}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}

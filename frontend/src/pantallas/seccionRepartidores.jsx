import React, { useState, useEffect } from "react";
import { exito, error } from "../servicios/notificaciones";

export default function SeccionRepartidores() {
  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Estados para la lista de repartidores y feedback
  const [repartidores, setRepartidores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Obtener la lista de repartidores del backend
  const obtenerRepartidores = async () => {
    try {
      const respuesta = await fetch("http://localhost:4000/api/repartidores");
      if (!respuesta.ok)
        throw new Error("No se pudo cargar la lista de repartidores.");
      const datos = await respuesta.json();
      setRepartidores(datos);
    } catch (err) {
      console.error(err);

      error("Error al cargar repartidores", err.message);
    } finally {
      setCargando(false);
      setGuardando(false);
    }
  };

  useEffect(() => {
    obtenerRepartidores();
  }, []);

  // 2. Enviar el formulario de alta
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);

    if (!nombre) {
      error("Datos inválidos", "El nombre del repartidor es obligatorio.");

      return;
    }

    const nuevoRepartidor = { nombre, telefono, vehiculo };

    try {
      const respuesta = await fetch("http://localhost:4000/api/repartidores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRepartidor),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        exito(
          "Repartidor registrado",
          `${datos.nombre} registrado correctamente.`,
        );
        setNombre("");
        setTelefono("");
        setVehiculo("");
        // Refrescamos la lista para que aparezca el nuevo al instante
        obtenerRepartidores();
      } else {
        error("No se pudo registrar", datos.error);
      }
    } catch (err) {
      error("Servidor desconectado", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      {/* Columna Izquierda: Formulario */}
      <div style={estilos.columnaForm}>
        <h2 style={estilos.titulo}>Registro de Repartidores</h2>
        <p style={estilos.subtitulo}>
          Da de alta al personal encargado de los repartos diarios.
        </p>

        <form onSubmit={manejarEnvio} style={estilos.formulario}>
          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Nombre Completo:</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={estilos.input}
              required
            />
          </div>

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Teléfono / Celular (Opcional):</label>
            <input
              type="text"
              placeholder="Ej: 2615555555"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              style={estilos.input}
            />
          </div>

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Vehículo (Opcional):</label>
            <input
              type="text"
              placeholder="Ej: Moto Honda Wave, Kangoo, Fiat Uno..."
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
              style={estilos.input}
            />
          </div>

          <button type="submit" disabled={guardando} style={estilos.boton}>
            {guardando ? "Registrando..." : "⚡ Registrar Repartidor"}
          </button>
        </form>
      </div>

      {/* Columna Derecha: Lista de Repartidores */}
      <div style={estilos.columnaLista}>
        <h3 style={estilos.tituloSeccion}>Personal Activo</h3>
        {cargando ? (
          <p>Cargando repartidores...</p>
        ) : repartidores.length === 0 ? (
          <p style={estilos.vacio}>No hay repartidores registrados todavía.</p>
        ) : (
          <div style={estilos.listaContainer}>
            {repartidores.map((rep) => (
              <div key={rep.id} style={estilos.tarjeta}>
                <div style={estilos.avatar}>👤</div>
                <div>
                  <h4 style={estilos.nombreRep}>{rep.nombre}</h4>
                  <p style={estilos.infoRep}>
                    {rep.vehiculo ? `Vehículo: ${rep.vehiculo}` : "A pie"}
                    {rep.telefono && ` |Tel: ${rep.telefono}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  contenedorPrincipal: {
    display: "flex",
    gap: "40px",
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Arial, sans-serif",
  },
  columnaForm: {
    flex: "1",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    height: "fit-content",
  },
  columnaLista: { flex: "1", padding: "20px" },
  titulo: { margin: "0 0 10px 0", color: "#333" },
  tituloSeccion: {
    margin: "0 0 20px 0",
    color: "#2c3e50",
    borderBottom: "2px solid #34495e",
    paddingBottom: "10px",
  },
  subtitulo: { fontSize: "14px", color: "#666", marginBottom: "20px" },
  formulario: { display: "flex", flexDirection: "column", gap: "15px" },
  grupoInput: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontWeight: "bold", fontSize: "14px", color: "#444" },
  input: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  boton: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#34495e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  alerta: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid",
    marginBottom: "15px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  vacio: { fontStyle: "italic", color: "#7f8c8d" },
  listaContainer: { display: "flex", flexDirection: "column", gap: "12px" },
  tarjeta: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
  },
  avatar: {
    fontSize: "24px",
    backgroundColor: "#e9ecef",
    padding: "8px",
    borderRadius: "50%",
  },
  nombreRep: { margin: "0 0 4px 0", color: "#2c3e50", fontSize: "16px" },
  infoRep: { margin: "0", fontSize: "13px", color: "#7f8c8d" },
};

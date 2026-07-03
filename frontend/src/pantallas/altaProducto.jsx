import React, { useState } from "react";
import { exito, error } from "../servicios/notificaciones";

export default function AltaProductos() {
  // 1. Definimos los estados para controlar los inputs del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockInicial, setStockInicial] = useState("");

  // Estados para manejar el feedback visual del usuario
  const [cargando, setCargando] = useState(false);

  // 2. Función que se ejecuta al enviar el formulario
  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setCargando(true);

    // Validaciones básicas en el frontend antes de mandar al backend
    if (!nombre || precio <= 0) {
      error("Datos inválidos", "Por favor, completa los campos correctamente.");

      setCargando(false);
      return;
    }

    // Armamos el objeto tal cual lo espera nuestro "productoControlador" en Node
    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      stockInicial: stockInicial ? parseFloat(stockInicial) : 0,
    };

    try {
      // 3. Hacemos la petición HTTP POST a nuestro Adaptador de Entrada en Node
      const respuesta = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Si el backend respondió con un 201 (Created)
        exito(
          "Producto registrado",
          `${datos.nombre} registrado correctamente.`,
        );
        // Limpiamos el formulario
        setNombre("");
        setPrecio("");
        setStockInicial("");
      } else {
        // Si el dominio rebotó la carga (ej: producto duplicado, error 400)
        error(
          "Error al registrar producto",
          `Error del sistema: ${datos.error}`,
        );
      }
    } catch (e) {
      // Si el servidor está apagado o hay error de red
      error(
        "Error de conexión",
        "No se pudo conectar con el servidor de la panadería.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Alta de Nuevos Productos</h2>
      <p style={estilos.subtitulo}>
        Cargá los productos de la panadería con sus respectivos precios.
      </p>

      {/* Formulario */}
      <form onSubmit={manejarEnvio} style={estilos.formulario}>
        <div style={estilos.grupoInput}>
          <label style={estilos.label}>Nombre del Producto:</label>
          <input
            type="text"
            placeholder="Ej: Pan Casero, Facturas de Crema..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
            style={estilos.input}
            required
          />
        </div>

        <div style={estilos.grupoInput}>
          <label style={estilos.label}>Precio de Venta ($):</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 1500"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={cargando}
            style={estilos.input}
            required
          />
        </div>

        <div style={estilos.grupoInput}>
          <label style={estilos.label}>Stock Inicial (Opcional):</label>
          <input
            type="number"
            step="0.5"
            min="0"
            placeholder="Ej: 50 o 50.5"
            value={stockInicial}
            onChange={(e) => setStockInicial(e.target.value)}
            disabled={cargando}
            style={estilos.input}
          />
        </div>

        <button type="submit" disabled={cargando} style={estilos.boton}>
          {cargando ? "Guardando..." : "Registrar Producto"}
        </button>
      </form>
    </div>
  );
}

// Estilos rápidos en línea para que no reniegues con CSS por ahora
const estilos = {
  contenedor: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  titulo: { margin: "0 0 10px 0", color: "#333" },
  subtitulo: { fontSize: "14px", color: "#666", marginBottom: "20px" },
  formulario: { display: "flex", flexDirection: "column", gap: "15px" },
  grupoInput: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontWeight: "bold", fontSize: "14px", color: "#444" },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  boton: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

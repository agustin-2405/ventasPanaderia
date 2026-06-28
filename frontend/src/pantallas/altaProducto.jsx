import React, { useState } from 'react';

export default function AltaProductos() {
  // 1. Definimos los estados para controlar los inputs del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  
  // Estados para manejar el feedback visual del usuario
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // tipo: 'exito' o 'error'
  const [cargando, setCargando] = useState(false);

  // 2. Función que se ejecuta al enviar el formulario
  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    // Validaciones básicas en el frontend antes de mandar al backend
    if (!nombre || precio <= 0) {
      setMensaje({ texto: 'Por favor, completa los campos correctamente.', tipo: 'error' });
      setCargando(false);
      return;
    }

    // Armamos el objeto tal cual lo espera nuestro "productoControlador" en Node
    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      stockInicial: stockInicial ? parseInt(stockInicial) : 0
    };

    try {
      // 3. Hacemos la petición HTTP POST a nuestro Adaptador de Entrada en Node
      const respuesta = await fetch('http://localhost:4000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Si el backend respondió con un 201 (Created)
        setMensaje({ texto: `¡${datos.nombre} cargado con éxito en el inventario!`, tipo: 'exito' });
        // Limpiamos el formulario
        setNombre('');
        setPrecio('');
        setStockInicial('');
      } else {
        // Si el dominio rebotó la carga (ej: producto duplicado, error 400)
        setMensaje({ texto: `Error del sistema: ${datos.error}`, tipo: 'error' });
      }
    } catch (error) {
      // Si el servidor está apagado o hay error de red
      setMensaje({ texto: 'No se pudo conectar con el servidor de la panadería.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Alta de Nuevos Productos</h2>
      <p style={estilos.subtitulo}>Cargá los productos de la panadería con sus respectivos precios.</p>

      {/* Alerta de Éxito o Error */}
      {mensaje.texto && (
        <div style={{
          ...estilos.alerta,
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
          borderColor: mensaje.tipo === 'exito' ? '#c3e6cb' : '#f5c6cb'
        }}>
          {mensaje.texto}
        </div>
      )}

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
            placeholder="Ej: 50 (Dejar en 0 si no hay)"
            value={stockInicial}
            onChange={(e) => setStockInicial(e.target.value)}
            disabled={cargando}
            style={estilos.input}
          />
        </div>

        <button type="submit" disabled={cargando} style={estilos.boton}>
          {cargando ? 'Guardando...' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  );
}

// Estilos rápidos en línea para que no reniegues con CSS por ahora
const estilos = {
  contenedor: { maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  titulo: { margin: '0 0 10px 0', color: '#333' },
  subtitulo: { fontSize: '14px', color: '#666', marginBottom: '20px' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '15px' },
  grupoInput: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontWeight: 'bold', fontSize: '14px', color: '#444' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  boton: { padding: '12px', fontSize: '16px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  alerta: { padding: '12px', borderRadius: '4px', border: '1px solid', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }
};
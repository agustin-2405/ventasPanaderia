import React, { useState, useEffect } from 'react';

export default function ControlStock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // 1. Cargar los productos desde el backend al montar la pantalla
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:4000/api/productos');
      if (!respuesta.ok) throw new Error('No se pudo obtener el inventario.');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // 2. Función para Modificar Stock (Suma o Resta)
  const modificarStock = async (productoId, cantidad, operacion) => {
    // Definimos a qué endpoint pegarle según el botón presionado
    const url = operacion === 'sumar' 
      ? 'http://localhost:4000/api/productos/agregar-stock' 
      : 'http://localhost:4000/api/productos/quitar-stock';

    try {
      const respuesta = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId, cantidad: parseInt(cantidad) })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Si todo salió bien, actualizamos el estado de React localmente 
        // para que impacte el nuevo stock en la pantalla al instante
        setProductos(prevProductos => 
          prevProductos.map(p => p.id === productoId ? { ...p, stock: datos.stock } : p)
        );
      } else {
        alert(`Error del dominio: ${datos.error}`);
      }
    } catch (err) {
      alert('Error de red al intentar actualizar el stock.');
    }
  };

  if (cargando) return <p style={estilos.centrado}>Cargando inventario de la panadería...</p>;
  if (error) return <p style={{...estilos.centrado, color: 'red'}}>Error: {error}</p>;

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Control de Stock</h2>
      <p style={estilos.subtitulo}>Aumentá o disminuí las existencias disponibles de la mercadería.</p>

      {productos.length === 0 ? (
        <p style={estilos.vacio}>No hay productos cargados. Usá la pantalla de Alta de Productos primero.</p>
      ) : (
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.encabezado}>
              <th style={estilos.celda}>Producto</th>
              <th style={estilos.celda}>Precio</th>
              <th style={estilos.celda}>Stock Actual</th>
              <th style={estilos.celdaAcciones}>Acciones rápidos (1 unidad)</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} style={estilos.fila}>
                <td style={estilos.celda}><strong>{producto.nombre}</strong></td>
                <td style={estilos.celda}>${producto.precio.toFixed(2)}</td>
                <td style={{
                  ...estilos.celda, 
                  color: producto.stock <= 5 ? '#c0392b' : '#2c3e50',
                  fontWeight: producto.stock <= 5 ? 'bold' : 'normal'
                }}>
                  {producto.stock} u. {producto.stock <= 5 && '(¡Bajo Stock!)'}
                </td>
                <td style={estilos.celdaAcciones}>
                  <button 
                    onClick={() => modificarStock(producto.id, 1, 'sumar')}
                    style={{...estilos.boton, backgroundColor: '#2ecc71'}}
                  >
                    ➕ Sumar 1
                  </button>
                  <button 
                    onClick={() => modificarStock(producto.id, 1, 'restar')}
                    style={{...estilos.boton, backgroundColor: '#e74c3c'}}
                  >
                    ➖ Restar 1
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const estilos = {
  contenedor: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  titulo: { margin: '0 0 10px 0', color: '#333' },
  subtitulo: { fontSize: '14px', color: '#666', marginBottom: '20px' },
  tabla: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  encabezado: { backgroundColor: '#34495e', color: 'white', textAlign: 'left' },
  celda: { padding: '12px', borderBottom: '1px solid #ddd', fontSize: '15px' },
  celdaAcciones: { padding: '12px', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px', justifyContent: 'center' },
  fila: { '&:hover': { backgroundColor: '#f5f5f5' } },
  boton: { padding: '6px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  centrado: { textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' },
  vacio: { fontStyle: 'italic', color: '#7f8c8d', marginTop: '20px' }
};
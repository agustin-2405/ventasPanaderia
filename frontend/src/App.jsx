import React, { useState, useEffect } from 'react';
import PlanillaReparto from './pantallas/planillaReparto';
import GestionPrecios from './pantallas/gestionPrecios';
import AltaProductos from './pantallas/altaProducto';
import SeccionRepartidores from './pantallas/seccionRepartidores';
import ControlStock from './pantallas/controlStock';
import HistorialPlanillas from './pantallas/historialPlanilla';

export default function App() {
  // Estado para saber qué pantalla mostrar basado en el hash de la URL
  const [ruta, setRuta] = useState(window.location.hash || '#reparto');

  useEffect(() => {
    // Escuchamos cuando el hash cambia (ej: cuando apretás el botón de Precios)
    const manejarCambioRuta = () => {
      setRuta(window.location.hash);
    };

    window.addEventListener('hashchange', manejarCambioRuta);
    return () => window.removeEventListener('hashchange', manejarCambioRuta);
  }, []);

  // Lógica de renderizado condicional
  const renderizarPantalla = () => {
    switch (ruta) {
      case '#precios':
        return <GestionPrecios />;
      case '#productos':
        return <AltaProductos />;
      case '#repartidores':
        return <SeccionRepartidores />;
      case '#historial':
        return <HistorialPlanillas />;
      case '#stock':
        return <ControlStock />;
      case '#reparto':
      default:
        return <PlanillaReparto />;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ padding: '15px', backgroundColor: '#2c3e50', display: 'flex', gap: '20px' }}>
        <a href="#productos" style={estilos.link}>Productos</a>
        <a href="#precios" style={estilos.link}>Precios</a>
        <a href="#repartidores" style={estilos.link}>Personal</a>
        <a href="#reparto" style={estilos.link}>Planilla</a>
        <a href="#historial" style={estilos.link}>Historial</a>
      </nav>
      <div style={{ padding: '20px' }}>
        {renderizarPantalla()}
      </div>
    </div>
  );
}

const estilos = {
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }
};
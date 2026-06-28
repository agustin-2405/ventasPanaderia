import React, { useState, useEffect } from 'react';

export default function PlanillaReparto() {
  // Datos maestros que traemos del backend
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estado de la planilla actual en la pantalla
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState('');
  const [cantidadesLlevadas, setCantidadesLlevadas] = useState({}); // { productoId: cantidad }
  const [cantidadesDevueltas, setCantidadesDevueltas] = useState({}); // { productoId: cantidad }
  const [preciosRepartidor, setPreciosRepartidor] = useState({}); // { productoId: precio }
  const [ajustes, setAjustes] = useState({}); // Para sumas/restas rápidas
  
  // Control de flujo de la pantalla
  const [fase, setFase] = useState('SALIDA'); // 'SALIDA' (Mañana) o 'RETORNO' (Tarde)
  const [planillaCreadaId, setPlanillaCreadaId] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Cargamos repartidores y productos en paralelo al entrar a la pantalla
    const cargarDatosMaestros = async () => {
      try {
        const [resRep, resProd] = await Promise.all([
          fetch('http://localhost:4000/api/repartidores'),
          fetch('http://localhost:4000/api/productos')
        ]);
        const reps = await resRep.json();
        const prods = await resProd.json();
        setRepartidores(reps);
        setProductos(prods);
      } catch (err) {
        alert('Error al cargar datos de logística.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatosMaestros();
  }, []);

  // Cada vez que cambia el repartidor, buscamos sus precios específicos
  useEffect(() => {
    if (repartidorSeleccionado) {
      fetch(`http://localhost:4000/api/repartos/precios/${repartidorSeleccionado}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al traer precios especiales');
          return res.json();
        })
        .then(datos => {
          console.log("Precios especiales cargados:", datos);
          setPreciosRepartidor(datos);
        })
        .catch(err => {
          console.error("Error fetch precios:", err);
          setPreciosRepartidor({});
        });
    } else {
      setPreciosRepartidor({});
    }
  }, [repartidorSeleccionado]);

  // Limpiar el estado al cambiar de repartidor para evitar que se mezclen los datos
  const manejarCambioRepartidor = (id) => {
    setRepartidorSeleccionado(id);
    setPlanillaCreadaId(null);
    setCantidadesLlevadas({});
    setCantidadesDevueltas({});
    setFase('SALIDA');
  };

  // Efecto para recuperar y continuar modificando una planilla del Historial
  useEffect(() => {
    if (productos.length === 0) return;

    const planillaGuardada = localStorage.getItem('planilla_a_cargar');
    if (planillaGuardada) {
      try {
        const planilla = JSON.parse(planillaGuardada);
        setPlanillaCreadaId(planilla.id);
        setRepartidorSeleccionado(planilla.repartidor_id || planilla.repartidorId);

        const items = planilla.productos || planilla.items || [];
        const llevadas = {};
        const devueltas = {};

        items.forEach(item => {
          const pId = item.productoId || item.producto_id;
          if (pId) {
            llevadas[pId] = item.cantidadLlevada ?? item.cantidad ?? 0;
            devueltas[pId] = item.cantidadDevuelta ?? 0;
          }
        });

        setCantidadesLlevadas(llevadas);
        setCantidadesDevueltas(devueltas);
        setFase(planilla.estado === 'CERRADA' ? 'RETORNO' : (planilla.estado || 'SALIDA'));
      } catch (err) {
        console.error("Error al rehidratar planilla:", err);
      } finally {
        localStorage.removeItem('planilla_a_cargar');
      }
    }
  }, [productos]);

  // Manejar el cambio en los inputs dinámicos de la tabla
  const manejarCambioCantidad = (productoId, valor, tipo) => {
    const cantidad = valor === '' ? 0 : parseInt(valor);
    if (tipo === 'llevada') {
      setCantidadesLlevadas(prev => ({ ...prev, [productoId]: cantidad }));
    } else {
      setCantidadesDevueltas(prev => ({ ...prev, [productoId]: cantidad }));
    }
  };

  // Función para sumar o restar mercadería durante el día
  const aplicarAjuste = (productoId, operacion) => {
    const valor = parseInt(ajustes[productoId] || 0);
    if (valor <= 0) return;

    setCantidadesLlevadas(prev => {
      const actual = prev[productoId] || 0;
      const nuevo = operacion === 'sumar' ? actual + valor : Math.max(0, actual - valor);
      return { ...prev, [productoId]: nuevo };
    });

    // Limpiar el campo de ajuste
    setAjustes(prev => ({ ...prev, [productoId]: '' }));
  };

  // 1. Despachar Reparto (Mañana)
  const registrarSalida = async () => {
    if (!repartidorSeleccionado) return alert('Por favor, selecciona un repartidor.');

    // Filtramos solo los productos que el repartidor efectivamente se lleva
    const itemsCargados = productos
      .filter(p => cantidadesLlevadas[p.id] > 0)
      .map(p => ({ productoId: p.id, cantidad: cantidadesLlevadas[p.id] }));

    if (itemsCargados.length === 0) return alert('Debes cargar al menos un producto para el reparto.');

    try {
      const url = planillaCreadaId 
        ? `http://localhost:4000/api/repartos/planilla/${planillaCreadaId}` 
        : 'http://localhost:4000/api/repartos/planilla';
      const metodo = planillaCreadaId ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repartidorId: repartidorSeleccionado, productos: itemsCargados })
      });
      const datos = await respuesta.json();

      if (respuesta.ok) {
        if (!planillaCreadaId) setPlanillaCreadaId(datos.id);
        alert('Carga guardada correctamente en el sistema.');
      } else {
        alert(`Error: ${datos.error}`);
      }
    } catch (err) {
      alert('Error al conectar con el servidor.');
    }
  };

  // 2. Rendición y Cierre de Planilla (Tarde)
  const cerrarPlanilla = async () => {
    try {
      const respuesta = await fetch(`http://localhost:4000/api/repartos/planilla/${planillaCreadaId}/cierre`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ devoluciones: cantidadesDevueltas })
      });
      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Planilla cerrada y rendida! El stock general fue actualizado.');
        // Reiniciamos la pantalla para el próximo reparto
        setPlanillaCreadaId(null);
        setRepartidorSeleccionado('');
        setCantidadesLlevadas({});
        setCantidadesDevueltas({});
        setFase('SALIDA');
      } else {
        alert(`Error del Dominio: ${datos.error}`);
      }
    } catch (err) {
      alert('Error de red al cerrar la planilla.');
    }
  };

  if (cargando) return <p style={estilos.centrado}>Cargando planilla de control...</p>;

  return (
    <div style={estilos.contenedor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={estilos.titulo}>Planilla de Control de Mercadería</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.location.hash = '#historial'} style={estilos.botonLink}>Historial</button>
          <button onClick={() => window.location.hash = '#precios'} style={estilos.botonLink}>Gestionar Precios</button>
        </div>
      </div>

      <p style={estilos.subtitulo}>
        {fase === 'SALIDA' 
          ? 'Fase Mañana: Registrá qué mercadería se lleva el repartidor.' 
          : 'Fase Tarde: Registrá las devoluciones para calcular las ventas.'}
      </p>

      {/* Selector de Repartidor (Solo activo a la mañana) */}
      <div style={estilos.selectorSeccion}>
        <label style={estilos.label}>Repartidor a cargo: </label>
        <select 
          value={repartidorSeleccionado} 
          onChange={(e) => manejarCambioRepartidor(e.target.value)}
          disabled={fase === 'RETORNO'}
          style={estilos.select}
        >
          <option value="">-- Seleccionar Repartidor --</option>
          {repartidores.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
      </div>

      {/* Tabla Dinámica de Mercadería */}
      <table style={estilos.tabla}>
        <thead>
          <tr style={estilos.encabezado}>
            <th style={estilos.celda}>Producto</th>
            <th style={estilos.celda}>Precio Unit.</th>
            <th style={estilos.celda}>Se Lleva (Mañana)</th>
            <th style={estilos.celda}>Devuelve (Tarde)</th>
            <th style={estilos.celda}>Vendido</th>
            <th style={estilos.celda}>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const llevado = cantidadesLlevadas[producto.id] || 0;
            const devuelto = cantidadesDevueltas[producto.id] || 0;
            const vendido = fase === 'RETORNO' ? Math.max(0, llevado - devuelto) : 0;
            // Usamos el precio especial si existe, sino el general
            const precioAplicado = preciosRepartidor[producto.id] || producto.precio || 0;
            const subtotal = vendido * precioAplicado;

            return (
              <tr key={producto.id} style={estilos.fila}>
                <td style={estilos.celda}><strong>{producto.nombre}</strong></td>
                <td style={estilos.celda}>${precioAplicado} {preciosRepartidor[producto.id] && '⭐'}</td>
                <td style={estilos.celda}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="number" 
                      value={cantidadesLlevadas[producto.id] || ''} 
                      onChange={(e) => manejarCambioCantidad(producto.id, e.target.value, 'llevada')}
                      style={estilos.inputTabla}
                    />
                    <div style={estilos.contenedorAjuste}>
                      <input 
                        type="number" 
                        placeholder="Ajuste"
                        value={ajustes[producto.id] || ''} 
                        onChange={(e) => setAjustes({...ajustes, [producto.id]: e.target.value})}
                        style={estilos.inputAjuste}
                      />
                      <button onClick={() => aplicarAjuste(producto.id, 'sumar')} style={{...estilos.btnAjuste, backgroundColor: '#27ae60'}}>+</button>
                      <button onClick={() => aplicarAjuste(producto.id, 'restar')} style={{...estilos.btnAjuste, backgroundColor: '#c0392b'}}>-</button>
                    </div>
                  </div>
                </td>
                <td style={estilos.celda}>
                  <input 
                    type="number" 
                    min="0"
                    value={cantidadesDevueltas[producto.id] || ''} 
                    onChange={(e) => manejarCambioCantidad(producto.id, e.target.value, 'retorno')}
                    onFocus={() => setFase('RETORNO')} 
                    style={estilos.inputTabla}
                    placeholder="0"
                  />
                </td>
                <td style={{...estilos.celda, fontWeight: 'bold', color: '#27ae60'}}>
                  {fase === 'RETORNO' ? `${vendido} u.` : '-'}
                </td>
                <td style={{...estilos.celda, fontWeight: 'bold', color: '#2c3e50'}}>
                  {fase === 'RETORNO' ? `$${subtotal.toLocaleString()}` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
        {fase === 'RETORNO' && (
          <tfoot>
            <tr style={{backgroundColor: '#f9f9f9'}}>
              <td colSpan="4" style={{...estilos.celda, textAlign: 'right', fontWeight: 'bold'}}>TOTAL RECAUDADO:</td>
              <td colSpan="2" style={{...estilos.celda, fontWeight: 'bold', color: '#27ae60', fontSize: '18px'}}>
                ${productos.reduce((acc, p) => {
                  const llevado = cantidadesLlevadas[p.id] || 0;
                  const devuelto = cantidadesDevueltas[p.id] || 0;
                  const vendido = Math.max(0, llevado - devuelto);
                  const precio = preciosRepartidor[p.id] || p.precio || 0;
                  return acc + (vendido * precio);
                }, 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Botones de Acción */}
      <div style={estilos.contenedorBoton}>
        <button onClick={registrarSalida} style={{...estilos.boton, backgroundColor: '#3498db', marginRight: '10px'}}>
           {planillaCreadaId ? 'Actualizar Carga (Media Mañana)' : 'Registrar Salida Inicial'}
        </button>
        
        {planillaCreadaId && (
          <button onClick={cerrarPlanilla} style={{...estilos.boton, backgroundColor: '#27ae60'}}>
             Finalizar Día y Cerrar Planilla
          </button>
        )}
      </div>
    </div>
  );
}

const estilos = {
  contenedor: { maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  titulo: { margin: '0 0 10px 0', color: '#333' },
  subtitulo: { fontSize: '14px', color: '#666', marginBottom: '25px' },
  selectorSeccion: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  label: { fontWeight: 'bold', color: '#444' },
  select: { padding: '8px 12px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc' },
  tabla: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  encabezado: { backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' },
  celda: { padding: '12px', borderBottom: '1px solid #ddd', fontSize: '15px' },
  inputTabla: { width: '70px', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center' },
  contenedorAjuste: { display: 'flex', gap: '2px', alignItems: 'center', marginLeft: '5px', borderLeft: '1px solid #eee', paddingLeft: '10px' },
  inputAjuste: { width: '50px', padding: '5px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd' },
  btnAjuste: { padding: '2px 8px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  contenedorBoton: { marginTop: '30px', display: 'flex', justifyContent: 'flex-end' },
  botonLink: { background: 'none', border: '1px solid #3498db', color: '#3498db', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  boton: { padding: '14px 24px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  centrado: { textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }
};
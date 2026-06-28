class PlanillaReparto {
  // Es fundamental recibir 'items = []' para que al rehidratar no se pierda la carga inicial
  constructor(props) {
    this.id = props.id;
    this.repartidorId = props.repartidorId || props.repartidor_id;
    this.fecha = props.fecha || new Date();
    this.estado = props.estado || 'ABIERTA'; // 'ABIERTA', 'SALIDA' o 'CERRADA'
    // Buscamos tanto en 'items' como en 'productos' para no perder datos de la DB
    const rawItems = props.items || props.productos || [];
    // Normalizamos los items para que el resto de métodos del dominio funcionen
    this.items = rawItems.map(item => ({
      productoId: item.productoId || item.producto_id,
      cantidadLlevada: item.cantidadLlevada ?? item.cantidad ?? 0,
      cantidadDevuelta: item.cantidadDevuelta ?? 0,
      cantidadVendida: item.cantidadVendida ?? (item.cantidadLlevada ?? item.cantidad ?? 0) - (item.cantidadDevuelta ?? 0)
    }));
  }

  // Agregar los productos que el repartidor carga a la mañana
  cargarMercaderia(productoId, cantidad) {
    if (this.estado === 'CERRADA') throw new Error("No se puede modificar una planilla cerrada.");
    
    this.items.push({
      productoId,
      cantidadLlevada: cantidad,
      cantidadDevuelta: 0,
      cantidadVendida: 0
    });
  }

  // Al final del día, se rinde la planilla
  rendirYTrabarPlanilla(devoluciones) {
    if (this.estado === 'CERRADA') throw new Error("La planilla ya está cerrada.");

    // devoluciones es un objeto: { productoId: cantidadDevuelta }
    this.items = this.items.map(item => {
      const devuelto = devoluciones[item.productoId] || 0;
      
      if (devuelto > item.cantidadLlevada) {
        throw new Error(`Error en producto ${item.productoId}: No pueden volver más productos de los que salieron.`);
      }

      return {
        ...item,
        cantidadDevuelta: devuelto,
        cantidadVendida: item.cantidadLlevada - devuelto
      };
    });

    this.estado = 'CERRADA';
  }
}

module.exports = PlanillaReparto;
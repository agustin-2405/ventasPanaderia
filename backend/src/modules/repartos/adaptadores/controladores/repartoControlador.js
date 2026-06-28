// src/modules/repartos/adaptadores/controladores/repartoControlador.js
const crypto = require('crypto');

// Importaciones de Casos de Uso y Repositorios
const CerrarPlanillaReparto = require('../../dominio/casosDeUso/cerrarPlanillaReparto');
const QuitarStock = require('../../../inventario/dominio/casosDeUso/quitarStock');
const planillaRepository = require('../proveedores/planillaRepositorioSupabase'); 
const inventarioRepository = require('../../../inventario/adaptadores/proveedores/productoRepositorioSupabase');
const supabase = require('../../../../supabaseClient');

const quitarStockUC = new QuitarStock(inventarioRepository);
const cerrarPlanillaUC = new CerrarPlanillaReparto(planillaRepository, quitarStockUC);

class RepartoControlador {

  async obtenerPreciosEspeciales(req, res) {
    const { repartidorId } = req.params;
    try {
      const { data, error } = await supabase
        .from('precios_especiales')
        .select('producto_id, precio')
        .eq('repartidor_id', repartidorId);

      if (error) {
        console.error("Error Supabase al obtener precios:", error);
        throw error;
      }

      // Transformamos el array en el objeto que espera el frontend { productoId: precio }
      const preciosMapa = data.reduce((acc, curr) => {
        acc[curr.producto_id] = curr.precio;
        return acc;
      }, {});

      return res.status(200).json(preciosMapa);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async guardarPreciosEspeciales(req, res) {
    try {
      const { repartidorId, listaPrecios } = req.body;
      
      if (!repartidorId || !listaPrecios) {
        return res.status(400).json({ error: "Datos incompletos: falta repartidorId o listaPrecios" });
      }

      // Preparamos los datos para un upsert (insertar o actualizar)
      const rows = Object.entries(listaPrecios)
        .filter(([_, precio]) => precio !== null && precio !== "") // Evitamos guardar valores vacíos
        .map(([productoId, precio]) => ({
          repartidor_id: repartidorId,
          producto_id: productoId,
          precio: parseFloat(precio)
        }));

      if (rows.length === 0) return res.status(200).json({ mensaje: "Nada que actualizar" });

      const { error } = await supabase.from('precios_especiales').upsert(rows);
      if (error) {
        console.error("Error en Upsert de Supabase:", error);
        throw error;
      }

      return res.status(200).json({ mensaje: "Lista de precios actualizada" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // === FASE MAÑANA: Crear la planilla al despachar ===
  async crearPlanilla(req, res) {
    try {
      const { repartidorId, productos } = req.body;

      if (!repartidorId || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Datos de reparto incompletos." });
      }
      
      // Estructura inicial de la planilla en memoria
      const nuevaPlanilla = {
        // Usamos un UUID para que Supabase lo acepte correctamente
        id: crypto.randomUUID(), 
        repartidorId: repartidorId, 
        productos: productos.map(p => ({
          productoId: p.productoId,
          cantidadLlevada: p.cantidad,
          cantidadDevuelta: 0
        })),
        estado: 'SALIDA',
        fecha: new Date()
      };
      
      await planillaRepository.save(nuevaPlanilla);
      return res.status(201).json(nuevaPlanilla);
    } catch (error) {
      console.error("Error al crear planilla en backend:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // === FASE TARDE: Rendición y cierre de totales ===
  async cerrarPlanilla(req, res) {
    try {
      const { id } = req.params;
      const { devoluciones } = req.body;

      // 1. Ejecutamos tu caso de uso del dominio (valida stock y cambia estados)
      const planillaCerrada = await cerrarPlanillaUC.execute({ planillaId: id, devoluciones });

      // 2. Usamos los items de la planilla devuelta por el dominio (que usa .items internamente)
      const detalleVentas = await Promise.all(planillaCerrada.items.map(async (item) => {
        const producto = await inventarioRepository.findById(item.productoId);
        // En el dominio, el item ya tiene los cálculos realizados
        const llevado = item.cantidadLlevada || item.cantidad || 0;
        const devuelto = item.cantidadDevuelta || 0;
        const vendido = item.cantidadVendida || 0;
        const subtotal = vendido * (producto ? producto.precio : 0);
        
        return {
          productoId: item.productoId,
          nombre: producto ? producto.nombre : "Producto desconocido",
          llevado,
          devuelto,
          vendido,
          subtotal
        };
      }));

      // 3. Sumamos todos los subtotales de manera síncrona y segura con un reduce
      const totalDineroGeneral = detalleVentas.reduce((acumulado, item) => acumulado + item.subtotal, 0);

      // 4. Devolvemos la respuesta final enriquecida a React
      return res.status(200).json({
        mensaje: "Planilla cerrada con éxito",
        id: id,
        repartidorId: planillaCerrada.repartidorId,
        totalVentas: totalDineroGeneral,
        productos: detalleVentas
      });

    } catch (error) {
      console.error("Error del Dominio al cerrar planilla:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // === ACTUALIZAR MERCADERÍA LLEVADA (Media Mañana) ===
  async actualizarPlanilla(req, res) {
    try {
      const { id } = req.params;
      const { productos } = req.body;

      if (!productos) {
        return res.status(400).json({ error: "Faltan datos de productos." });
      }

      const { data: planilla, error: fetchError } = await supabase
        .from('planillas')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !planilla) return res.status(404).json({ error: "Planilla no encontrada." });
      if (planilla.estado === 'CERRADA') return res.status(400).json({ error: "No se puede modificar una planilla cerrada." });

      const productosActualizados = productos.map(p => ({
        productoId: p.productoId || p.producto_id,
        cantidadLlevada: p.cantidad ?? p.cantidadLlevada ?? 0,
        cantidadDevuelta: 0
      }));

      const { error } = await supabase.from('planillas').update({ productos: productosActualizados }).eq('id', id);
      if (error) throw error;

      return res.status(200).json({ mensaje: "Planilla de carga actualizada", productos: productosActualizados });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async obtenerHistorial(req, res) {
    const { repartidorId } = req.params;
    try {
      console.log(`Backend: Buscando historial para repartidorId: ${repartidorId}`); // Debug: Qué ID se está buscando
      const { data, error } = await supabase
        .from('planillas')
        .select('*, repartidores(nombre)')
        .eq('repartidor_id', repartidorId)
        .order('fecha', { ascending: false });

      console.log(`Backend: Supabase query returned ${data ? data.length : 0} planillas.`); // Debug: Cuántas planillas se encontraron
      if (error) throw error;
      
      // Normalizamos para el frontend: convertimos 'items' en 'productos' si fuera necesario
      const normalizado = data.map(p => ({
        ...p,
        productos: p.productos || p.items || []
      }));

      return res.status(200).json(normalizado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RepartoControlador();
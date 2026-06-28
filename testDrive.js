// testDrive.js
const productoRepo = require('./backend/src/modules/inventario/adaptadores/proveedores/productoRepositorioMySQL');
const planillaRepo = require('./backend/src/modules/repartos/adaptadores/proveedores/planillaRepositorioMySQL');
const CargarProducto = require('./backend/src/modules/inventario/dominio/casosDeUso/cargarProducto');
const AgregarStock = require('./backend/src/modules/inventario/dominio/casosDeUso/agregarStock');
const QuitarStock = require('./backend/src/modules/inventario/dominio/casosDeUso/quitarStock');
const CerrarPlanillaReparto = require('./backend/src/modules/repartos/dominio/casosDeUso/cerrarPlanillaReparto');
const PlanillaReparto = require('./backend/src/modules/repartos/dominio/entidades/PlanillaReparto');
const { randomUUID } = require('crypto');
const pool = require('./backend/src/config/database');

async function probarSistema() {
  console.log("=== 🥖 PROBANDO DOMINIO DE LA PANADERÍA ===");

  const cargarProductoUC = new CargarProducto(productoRepo);
  const agregarStockUC = new AgregarStock(productoRepo);
  const quitarStockUC = new QuitarStock(productoRepo);
  const cerrarPlanillaUC = new CerrarPlanillaReparto(planillaRepo, quitarStockUC);

  try {
    console.log("\n1. Cargando 'Pan Casero'...");
    const pan = await cargarProductoUC.execute({ nombre: "Pan Casero", precio: 1500, stockInicial: 10 });
    console.log("✅ Producto creado con éxito:", pan);

    console.log("\n2. Intentando duplicar producto...");
    await cargarProductoUC.execute({ nombre: "Pan Casero", precio: 1800 });

  } catch (error) {
    console.log("❌ Atajado por el dominio:", error.message);
  }

  try {
    console.log("\n3. Salió una tanda del horno! Agregando stock...");
    const todos = await productoRepo.findAll();
    const panId = todos[0].id;

    const panActualizado = await agregarStockUC.execute({ productoId: panId, cantidad: 50 });
    console.log("✅ Stock actualizado en DB:", panActualizado);

    // --- NUEVA PRUEBA DE INTEGRACIÓN ---
    console.log("\n--- 🚛 PROBANDO MÓDULO DE REPARTOS ---");
    
    // Simulamos una planilla que sale a la calle
    const planilla = new PlanillaReparto({
      id: randomUUID(),
      repartidorId: 'rep-001'
    });
    
    // El repartidor carga 20 panes
    planilla.cargarMercaderia(panId, 20);
    console.log("📦 Repartidor salió con 20 unidades.");

    // Guardamos el estado inicial de la planilla en la DB
    await planillaRepo.save(planilla);
    console.log("💾 Planilla inicial guardada en MySQL.");

    console.log("🔚 El repartidor vuelve. Devolvió 5 panes (vendió 15).");
    await cerrarPlanillaUC.execute({
      planillaId: planilla.id,
      devoluciones: { [panId]: 5 }
    });
    console.log("💾 Planilla cerrada y procesada en MySQL.");

    const stockFinal = await productoRepo.findById(panId);
    console.log(`\n📊 RESULTADO FINAL EN INVENTARIO:`);
    console.log(`Producto: ${stockFinal.nombre}`);
    console.log(`Stock esperado: 45 (60 inicial - 15 vendidos)`);
    console.log(`Stock real: ${stockFinal.stock}`);
    
    if (stockFinal.stock === 45) {
      console.log("\n🔥 ¡SISTEMA FUNCIONAL! La integración entre módulos es correcta.");
    }

  } catch (error) {
    console.error("❌ Error en la prueba:", error);
  } finally {
    // Cerramos la conexión para que el script termine
    await pool.end();
  }
}

probarSistema();
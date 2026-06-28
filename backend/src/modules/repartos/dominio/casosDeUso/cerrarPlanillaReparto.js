const PlanillaReparto = require('../entidades/PlanillaReparto');

class CerrarPlanillaReparto {
  // Le inyectamos su propio repositorio Y el caso de uso del otro módulo
  constructor(planillaRepository, quitarStockUseCase) {
    this.planillaRepository = planillaRepository;
    this.quitarStockUseCase = quitarStockUseCase; 
  }

  async execute({ planillaId, devoluciones }) {
    // 1. Buscar la planilla en la base de datos
    const planillaData = await this.planillaRepository.findById(planillaId);
    if (!planillaData) throw new Error("La planilla no existe.");

    // 2. Rehidratar la entidad de dominio
    const planilla = new PlanillaReparto(planillaData);

    // 3. Lógica de negocio: Calcula ventas y cambia estado a 'CERRADA'
    planilla.rendirYTrabarPlanilla(devoluciones);

    // 4. Guardar los cambios de la planilla
    await this.planillaRepository.save(planilla);

    // 5. COMUNICACIÓN ENTRE MÓDULOS:
    // Recorremos los ítems ya calculados y descontamos del inventario lo vendido
    for (const item of planilla.items) {
      if (item.cantidadVendida > 0) {
        await this.quitarStockUseCase.execute({
          productoId: item.productoId,
          cantidad: item.cantidadVendida
        });
      }
    }

    return planilla;
  }
}

module.exports = CerrarPlanillaReparto;
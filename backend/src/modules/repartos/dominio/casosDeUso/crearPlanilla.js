class CrearPlanilla {
  constructor(planillaRepository) {
    this.planillaRepository = planillaRepository;
  }

  async execute({ repartidorId, productos }) {
    if (!repartidorId) {
      throw new Error("Debe seleccionarse un repartidor.");
    }

    if (!productos || productos.length === 0) {
      throw new Error("La planilla debe contener al menos un producto.");
    }

    const planilla = {
      repartidorId,
      fecha: new Date(),
      estado: "ABIERTA",
      productos: productos.map((p) => ({
        productoId: p.productoId,
        cantidadLlevada: p.cantidad,
        cantidadDevuelta: 0,
      })),
    };

    return this.planillaRepository.save(planilla);
  }
}

module.exports = CrearPlanilla;
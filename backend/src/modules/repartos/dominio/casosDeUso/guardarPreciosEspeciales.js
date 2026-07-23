class GuardarPreciosEspeciales {
  constructor(planillaRepository) {
    this.planillaRepository = planillaRepository;
  }

  async execute({ repartidorId, listaPrecios }) {
    if (!repartidorId) {
      throw new Error("Debe indicar un repartidor.");
    }

    if (!listaPrecios) {
      throw new Error("Debe indicar una lista de precios.");
    }

    return await this.planillaRepository.guardarPreciosEspeciales(
      repartidorId,
      listaPrecios,
    );
  }
}

module.exports = GuardarPreciosEspeciales;

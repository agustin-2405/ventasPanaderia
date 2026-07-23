class ObtenerPreciosEspeciales {
  constructor(planillaRepository) {
    this.planillaRepository = planillaRepository;
  }

  async execute(repartidorId) {
    if (!repartidorId) {
      throw new Error("Debe indicar un repartidor.");
    }

    return await this.planillaRepository.obtenerPreciosEspeciales(repartidorId);
  }
}

module.exports = ObtenerPreciosEspeciales;

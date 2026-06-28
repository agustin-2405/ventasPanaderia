class PlanillaRepositorioEnMemoria {
  constructor() {
    this.planillas = [];
  }

  async save(planilla) {
    this.planillas.push(planilla);
    return planilla;
  }

  async findById(id) {
    return this.planillas.find(p => p.id === id) || null;
  }

  async update(planilla) {
    const index = this.planillas.findIndex(p => p.id === planilla.id);
    if (index !== -1) {
      this.planillas[index] = planilla;
    }
    return planilla;
  }
}

module.exports = new PlanillaRepositorioEnMemoria();
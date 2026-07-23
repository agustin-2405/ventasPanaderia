class RegistrarRepartidor {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ nombre, telefono, vehiculo }) {
    if (!nombre) {
      throw new Error("El nombre del repartidor es obligatorio.");
    }

    return this.repository.save({
      nombre,
      telefono,
      vehiculo,
    });
  }
}

module.exports = RegistrarRepartidor;
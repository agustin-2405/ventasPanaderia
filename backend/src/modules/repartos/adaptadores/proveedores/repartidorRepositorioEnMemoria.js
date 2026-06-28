class RepartidorRepositorioEnMemoria {
  constructor() {
    this.repartidores = [];
    this.idContador = 1;
  }

  async save(repartidor) {
    const nuevo = {
      id: this.idContador++,
      nombre: repartidor.nombre,
      telefono: repartidor.telefono || '',
      vehiculo: repartidor.vehiculo || ''
    };
    this.repartidores.push(nuevo);
    return nuevo;
  }

  async findAll() {
    return this.repartidores;
  }

  async findById(id) {
    return this.repartidores.find(r => r.id === parseInt(id)) || null;
  }
}

module.exports = new RepartidorRepositorioEnMemoria();
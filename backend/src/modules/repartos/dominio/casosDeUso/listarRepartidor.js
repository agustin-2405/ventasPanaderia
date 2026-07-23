class ListarRepartidor {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.findAll();
  }
}

module.exports = ListarRepartidor;
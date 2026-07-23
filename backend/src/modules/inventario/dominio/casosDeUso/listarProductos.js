class ListarProductos {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.listar();
  }
}

module.exports = ListarProductos;
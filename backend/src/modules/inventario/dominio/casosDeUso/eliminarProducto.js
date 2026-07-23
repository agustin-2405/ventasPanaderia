class EliminarProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error("Producto inválido.");
    }

    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    return await this.productoRepository.eliminar(id);
  }
}

module.exports = EliminarProducto;

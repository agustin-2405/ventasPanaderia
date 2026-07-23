class ActualizarProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(id, datos) {
    if (!id) {
      throw new Error("Producto inválido.");
    }

    if (!datos.nombre?.trim()) {
      throw new Error("Debe ingresar un nombre.");
    }

    if (Number(datos.precio) <= 0) {
      throw new Error("El precio debe ser mayor que cero.");
    }

    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    return await this.productoRepository.actualizar(id, {
      nombre: datos.nombre.trim(),
      precio: Number(datos.precio),
    });
  }
}

module.exports = ActualizarProducto;

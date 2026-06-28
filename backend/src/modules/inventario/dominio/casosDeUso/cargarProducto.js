const { randomUUID } = require('crypto');
const Producto = require('../entidades/Producto');

class CargarProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute({ nombre, precio, stockInicial }) {
    const productoExistente = await this.productoRepository.findByNombre(nombre);

    if (productoExistente) {
      throw new Error("Ya existe un producto con ese nombre en la panadería.");
    }

    const nuevoProducto = new Producto({
      id: randomUUID(),
      nombre,
      precio,
      stock: stockInicial || 0
    });

    await this.productoRepository.save(nuevoProducto);

    return nuevoProducto;
  }
}

module.exports = CargarProducto;
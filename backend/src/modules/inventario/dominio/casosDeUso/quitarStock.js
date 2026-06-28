const Producto = require('../entidades/Producto');

class QuitarStock {
  // Le inyectamos el repositorio por constructor (Inyección de Dependencias)
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute({ productoId, cantidad }) {
    // 1. Buscamos el producto a través del puerto (abstracción de la BD)
    const productoData = await this.productoRepository.findById(productoId);
    if (!productoData) throw new Error("Producto no encontrado");

    // 2. Rehidratamos la entidad del dominio para recuperar sus métodos de negocio
    const producto = new Producto(productoData);

    // 3. Ejecutamos la lógica de negocio pura
    producto.quitarStock(cantidad);

    // 4. Guardamos el estado actualizado mediante el puerto
    await this.productoRepository.save(producto);

    return producto;
  }
}

module.exports = QuitarStock;
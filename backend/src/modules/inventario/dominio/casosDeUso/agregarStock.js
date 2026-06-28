const Producto = require('../entidades/Producto');

class AgregarStock {
  // Inyectamos el puerto (repositorio) por el constructor
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute({ productoId, cantidad }) {
    // 1. Buscamos el producto actual mediante el puerto de salida
    const productoData = await this.productoRepository.findById(productoId);
    if (!productoData) {
      throw new Error("El producto que intentas abastecer no existe.");
    }

    // 2. Rehidratamos los datos en nuestra entidad de Dominio
    const producto = new Producto(productoData);

    // 3. Ejecutamos la regla de negocio de la entidad
    producto.agregarStock(cantidad);

    // 4. Guardamos los cambios usando nuevamente el puerto
    await this.productoRepository.save(producto);

    // 5. Devolvemos el producto actualizado (para que el frontend de React sepa el nuevo stock)
    return producto;
  }
}

module.exports = AgregarStock;
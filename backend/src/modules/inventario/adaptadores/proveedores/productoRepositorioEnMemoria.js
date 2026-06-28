class ProductoRepositorioEnMemoria {
  constructor() {
    this.productos = new Map();
  }

  async save(producto) {
    this.productos.set(producto.id, {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock
    });
    return producto;
  }

  async findById(id) {
    const producto = this.productos.get(id);
    if (!producto) return null;
    return { ...producto };
  }

  async findByNombre(nombre) {
    const productosArray = Array.from(this.productos.values());
    const producto = productosArray.find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (!producto) return null;
    return { ...producto };
  }

  async findAll() {
    return Array.from(this.productos.values());
  }
}

const repositorio = new ProductoRepositorioEnMemoria();
module.exports = repositorio;
class Producto {
  constructor({ id, nombre, precio, stock = 0 }) {
    if (!nombre) throw new Error("El producto debe tener un nombre.");
    if (precio <= 0) throw new Error("El precio debe ser mayor a cero.");
    
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  quitarStock(cantidad) {
    if (cantidad <= 0) throw new Error("La cantidad a quitar debe ser mayor a cero.");
    if (this.stock - cantidad < 0) {
      throw new Error(`Stock insuficiente para ${this.nombre}. Stock actual: ${this.stock}`);
    }
    this.stock -= cantidad;
  }

  agregarStock(cantidad) {
    if (cantidad <= 0) throw new Error("La cantidad a agregar debe ser mayor a cero.");
    this.stock += cantidad;
  }

  actualizarPrecio(nuevoPrecio) {
    if (nuevoPrecio <= 0) throw new Error("El nuevo precio debe ser mayor a cero.");
    this.precio = nuevoPrecio;
  }
}

module.exports = Producto;
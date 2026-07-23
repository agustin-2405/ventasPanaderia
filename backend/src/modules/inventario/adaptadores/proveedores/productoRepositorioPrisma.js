const prisma = require("../../../../config/database");

class ProductoRepositorioPrisma {
  async save(producto) {
    return prisma.producto.create({
      data: {
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
      },
    });
  }

  async listar() {
    return prisma.producto.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
  }

  async findByNombre(nombre) {
    return prisma.producto.findUnique({
      where: { nombre },
    });
  }

  async findById(id) {
    return prisma.producto.findUnique({
      where: { id },
    });
  }

  async updateStock(id, stock) {
    return prisma.producto.update({
      where: { id },
      data: { stock },
    });
  }

  async actualizar(id, datos) {
    return prisma.producto.update({
      where: {
        id,
      },
      data: {
        nombre: datos.nombre,
        precio: datos.precio,
      },
    });
  }

  async eliminar(id) {
    const cantidadUsos = await prisma.itemPlanilla.count({
      where: {
        productoId: id,
      },
    });

    if (cantidadUsos > 0) {
      throw new Error(
        "No se puede eliminar el producto porque forma parte del historial de ventas.",
      );
    }

    return prisma.producto.delete({
      where: {
        id,
      },
    });
  }
}

module.exports = new ProductoRepositorioPrisma();

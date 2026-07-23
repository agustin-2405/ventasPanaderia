const prisma = require("../../../../config/database");

class RepartidorRepositorioPrisma {
  async save(repartidor) {
    return prisma.repartidor.create({
      data: {
        nombre: repartidor.nombre,
        telefono: repartidor.telefono,
        vehiculo: repartidor.vehiculo,
      },
    });
  }

  async findAll() {
    return prisma.repartidor.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
  }

  async findById(id) {
    return prisma.repartidor.findUnique({
      where: {
        id,
      },
    });
  }
}

module.exports = new RepartidorRepositorioPrisma();
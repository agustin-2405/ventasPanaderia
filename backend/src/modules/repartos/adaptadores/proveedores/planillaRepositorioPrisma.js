const prisma = require("../../../../config/database");

class PlanillaRepositorioPrisma {
  async save(planilla) {
    return prisma.planilla.create({
      data: {
        repartidorId: planilla.repartidorId,
        estado: planilla.estado,
        fecha: planilla.fecha,
        items: {
          create: planilla.productos.map((item) => ({
            productoId: item.productoId,
            cantidadLlevada: item.cantidadLlevada,
            cantidadDevuelta: item.cantidadDevuelta,
          })),
        },
      },
      include: {
        repartidor: true,
        items: true,
      },
    });
  }

  async findById(id) {
    return await prisma.planilla.findUnique({
      where: {
        id,
      },

      include: {
        repartidor: true,

        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async actualizar(id, productos) {
    return await prisma.$transaction(async (tx) => {
      // Eliminamos todos los items actuales
      await tx.itemPlanilla.deleteMany({
        where: {
          planillaId: id,
        },
      });

      // Creamos los nuevos
      return await tx.planilla.update({
        where: {
          id,
        },

        data: {
          items: {
            create: productos.map((p) => ({
              productoId: p.productoId,
              cantidadLlevada: p.cantidad,
              cantidadDevuelta: 0,
            })),
          },
        },

        include: {
          repartidor: true,

          items: {
            include: {
              producto: true,
            },
          },
        },
      });
    });
  }

  async cerrar(id, devoluciones) {
    return await prisma.$transaction(async (tx) => {
      // Actualizamos las devoluciones de cada item
      for (const devolucion of devoluciones) {
        await tx.itemPlanilla.updateMany({
          where: {
            planillaId: id,
            productoId: devolucion.productoId,
          },

          data: {
            cantidadDevuelta: devolucion.cantidad,
          },
        });

        // Sumamos las devoluciones al stock
        await tx.producto.update({
          where: {
            id: devolucion.productoId,
          },

          data: {
            stock: {
              increment: devolucion.cantidad,
            },
          },
        });
      }

      // Cerramos la planilla
      return await tx.planilla.update({
        where: {
          id,
        },

        data: {
          estado: "CERRADA",
        },

        include: {
          repartidor: true,

          items: {
            include: {
              producto: true,
            },
          },
        },
      });
    });
  }

  async obtenerHistorial(repartidorId) {
    return await prisma.planilla.findMany({
      where: {
        repartidorId,
      },

      orderBy: {
        fecha: "desc",
      },

      include: {
        repartidor: true,

        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  // Precios especiales
  async obtenerPreciosEspeciales(repartidorId) {
    const precios = await prisma.precioEspecial.findMany({
      where: {
        repartidorId,
      },
    });

    // Lo convertimos a:
    // { productoId: precio }
    return precios.reduce((acc, item) => {
      acc[item.productoId] = Number(item.precio);
      return acc;
    }, {});
  }

  async guardarPreciosEspeciales(repartidorId, listaPrecios) {
    for (const [productoId, precio] of Object.entries(listaPrecios)) {
      if (precio === "" || precio === null || precio === undefined) {
        continue;
      }

      await prisma.precioEspecial.upsert({
        where: {
          repartidorId_productoId: {
            repartidorId,
            productoId,
          },
        },

        update: {
          precio,
        },

        create: {
          repartidorId,
          productoId,
          precio,
        },
      });
    }

    return true;
  }
}

module.exports = new PlanillaRepositorioPrisma();

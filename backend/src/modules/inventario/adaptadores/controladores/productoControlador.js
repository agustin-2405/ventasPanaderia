const repository = require("../proveedores/productoRepositorioPrisma");

const CargarProducto = require("../../dominio/casosDeUso/cargarProducto");
const ListarProductos = require("../../dominio/casosDeUso/listarProductos");
const ActualizarProducto = require("../../dominio/casosDeUso/actualizarProducto");
const EliminarProducto = require("../../dominio/casosDeUso/eliminarProducto");

const cargarProductoUC = new CargarProducto(repository);
const listarProductosUC = new ListarProductos(repository);
const actualizarProductoUC = new ActualizarProducto(repository);
const eliminarProductoUC = new EliminarProducto(repository);

class ProductoController {
  async cargar(req, res) {
    try {
      const { nombre, precio, stockInicial } = req.body;

      const nuevoProducto = await cargarProductoUC.execute({
        nombre,
        precio,
        stockInicial,
      });

      return res.status(201).json(nuevoProducto);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async listar(req, res) {
    try {
      const productos = await listarProductosUC.execute();

      return res.status(200).json(productos);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;

      const { nombre, precio } = req.body;

      const producto = await actualizarProductoUC.execute(id, {
        nombre,
        precio,
      });

      return res.status(200).json(producto);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;

      await eliminarProductoUC.execute(id);

      return res.status(200).json({
        mensaje: "Producto eliminado correctamente.",
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new ProductoController();

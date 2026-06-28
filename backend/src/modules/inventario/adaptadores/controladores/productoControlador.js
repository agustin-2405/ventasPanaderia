// src/modules/inventario/adapters/controllers/productoController.js
const repository = require('../proveedores/productoRepositorioSupabase');
const CargarProducto = require('../../dominio/casosDeUso/cargarProducto');
const AgregarStock = require('../../dominio/casosDeUso/agregarStock');
const QuitarStock = require('../../dominio/casosDeUso/quitarStock');

// Instanciamos los casos de uso con el repositorio compartido
const cargarProductoUC = new CargarProducto(repository);
const agregarStockUC = new AgregarStock(repository);
const quitarStockUC = new QuitarStock(repository);

class ProductoController {
  
  // POST /api/productos (Pantalla: Cargar Productos)
  async cargar(req, res) {
    try {
      const { nombre, precio, stockInicial } = req.body;
      const nuevoProducto = await cargarProductoUC.execute({ nombre, precio, stockInicial });
      return res.status(201).json(nuevoProducto);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/productos/agregar-stock (Pantalla: Control de Stock)
  async agregarStock(req, res) {
    try {
      const { productoId, cantidad } = req.body;
      const producto = await agregarStockUC.execute({ productoId, cantidad });
      return res.status(200).json(producto);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/productos/quitar-stock (Pantalla: Control de Stock)
  async quitarStock(req, res) {
    try {
      const { productoId, cantidad } = req.body;
      const producto = await quitarStockUC.execute({ productoId, cantidad });
      return res.status(200).json(producto);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/productos (Para listar en tus pantallas de React)
  async listar(req, res) {
    const productos = await repository.listar();
    return res.status(200).json(productos);
  }
}

module.exports = new ProductoController();
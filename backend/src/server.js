// /backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Inicializamos la app una sola vez
const app = express();

// 2. Middlewares globales obligatorios
app.use(cors()); // Maneja el CORS de forma limpia y automática para tu React
app.use(express.json()); // Middleware para poder leer JSON en el body

// 3. Importar Controladores (Asegurate de que los archivos existan en esas rutas)
const productoController = require('./modules/inventario/adaptadores/controladores/productoControlador');
const repartidorController = require('./modules/repartos/adaptadores/controladores/repartidorControlador');
const repartoController = require('./modules/repartos/adaptadores/controladores/repartoControlador');

// 4. Enrutamiento de Inventario
app.post('/api/productos', (req, res) => productoController.cargar(req, res));
app.get('/api/productos', (req, res) => productoController.listar(req, res));
app.patch('/api/productos/agregar-stock', (req, res) => productoController.agregarStock(req, res));
app.patch('/api/productos/quitar-stock', (req, res) => productoController.quitarStock(req, res));

// 5. Enrutamiento de Repartidores (Módulo Repartos)
app.post('/api/repartidores', (req, res) => repartidorController.registrar(req, res));
app.get('/api/repartidores', (req, res) => repartidorController.listar(req, res));

// 6. Enrutamiento de Planillas de Reparto (Módulo Repartos)
app.post('/api/repartos/planilla', (req, res) => repartoController.crearPlanilla(req, res));
app.put('/api/repartos/planilla/:id', (req, res) => repartoController.actualizarPlanilla(req, res));
app.put('/api/repartos/planilla/:id/cierre', (req, res) => repartoController.cerrarPlanilla(req, res));
app.get('/api/repartos/precios/:repartidorId', (req, res) => repartoController.obtenerPreciosEspeciales(req, res));
app.post('/api/repartos/precios', (req, res) => repartoController.guardarPreciosEspeciales(req, res));
app.get('/api/repartos/historial/:repartidorId', (req, res) => repartoController.obtenerHistorial(req, res));

// 7. Encendido del Servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de la panadería corriendo en http://localhost:${PORT}`);
});
const planillaRepository = require("../proveedores/planillaRepositorioPrisma");
const CrearPlanilla = require("../../dominio/casosDeUso/crearPlanilla");
const ObtenerPlanilla = require("../../dominio/casosDeUso/obtenerPlanilla");
const ActualizarPlanilla = require("../../dominio/casosDeUso/actualizarPlanilla");
const CerrarPlanilla = require("../../dominio/casosDeUso/cerrarPlanilla");
const ObtenerHistorial = require("../../dominio/casosDeUso/obtenerHistorial");
const ObtenerPreciosEspeciales = require("../../dominio/casosDeUso/obtenerPreciosEspeciales");
const GuardarPreciosEspeciales = require("../../dominio/casosDeUso/guardarPreciosEspeciales");

const crearPlanillaUC = new CrearPlanilla(planillaRepository);
const obtenerPlanillaUC = new ObtenerPlanilla(planillaRepository);
const actualizarPlanillaUC = new ActualizarPlanilla(planillaRepository);
const cerrarPlanillaUC = new CerrarPlanilla(planillaRepository);
const obtenerHistorialUC = new ObtenerHistorial(planillaRepository);
const obtenerPreciosEspecialesUC = new ObtenerPreciosEspeciales(
  planillaRepository,
);
const guardarPreciosEspecialesUC = new GuardarPreciosEspeciales(
  planillaRepository,
);

class RepartoControlador {
  async crearPlanilla(req, res) {
    try {
      const { repartidorId, productos } = req.body;

      const planilla = await crearPlanillaUC.execute({
        repartidorId,
        productos,
      });

      return res.status(201).json(planilla);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async obtener(req, res) {
    try {
      const { id } = req.params;

      const planilla = await obtenerPlanillaUC.execute(id);

      return res.json(planilla);
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { productos } = req.body;

      const planilla = await actualizarPlanillaUC.execute(id, productos);

      return res.json(planilla);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async cerrar(req, res) {
    try {
      const { id } = req.params;
      const { devoluciones } = req.body;

      const planilla = await cerrarPlanillaUC.execute(id, devoluciones);

      return res.json(planilla);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async historial(req, res) {
    try {
      const { repartidorId } = req.params;

      const historial = await obtenerHistorialUC.execute(repartidorId);

      return res.json(historial);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async obtenerPreciosEspeciales(req, res) {
    try {
      const { repartidorId } = req.params;

      const precios = await obtenerPreciosEspecialesUC.execute(repartidorId);

      return res.json(precios);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async guardarPreciosEspeciales(req, res) {
    try {
      const { repartidorId, listaPrecios } = req.body;

      await guardarPreciosEspecialesUC.execute({
        repartidorId,
        listaPrecios,
      });

      return res.json({
        mensaje: "Lista de precios guardada correctamente.",
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new RepartoControlador();

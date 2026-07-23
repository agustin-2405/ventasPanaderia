const repository = require("../proveedores/repartidorRepositorioPrisma");

class RepartidorControlador {
  
  async registrar(req, res) {
    try {
      const { nombre, telefono, vehiculo } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: "El nombre del repartidor es obligatorio." });
      }

      // El repositorio en memoria simula el guardado y genera un ID
      const nuevoRepartidor = await repository.save({ nombre, telefono, vehiculo });
      
      return res.status(201).json(nuevoRepartidor);
    } catch (error) {
      console.error("Error al registrar repartidor:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
      const repartidores = await repository.findAll();
      return res.status(200).json(repartidores);
    } catch (error) {
      console.error("Error al listar repartidores:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RepartidorControlador();
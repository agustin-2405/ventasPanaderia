const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productoController = require("./modules/inventario/adaptadores/controladores/productoControlador");
const repartidorController = require("./modules/repartos/adaptadores/controladores/repartidorControlador");
const repartoController = require("./modules/repartos/adaptadores/controladores/repartoControlador");

const app = express();

app.use(cors());
app.use(express.json());

/* ==========================
   INVENTARIO
========================== */

app.post("/api/productos", (req, res) => productoController.cargar(req, res));

app.get("/api/productos", (req, res) => productoController.listar(req, res));

app.patch("/api/productos/:id", (req, res) =>
  productoController.actualizar(req, res),
);

app.delete("/api/productos/:id", (req, res) =>
  productoController.eliminar(req, res),
);

/* ==========================
   REPARTIDORES
========================== */

app.post("/api/repartidores", (req, res) =>
  repartidorController.registrar(req, res),
);

app.get("/api/repartidores", (req, res) =>
  repartidorController.listar(req, res),
);

/* ==========================
   PLANILLAS
========================== */

app.post("/api/repartos/planilla", (req, res) =>
  repartoController.crearPlanilla(req, res),
);

app.get("/api/repartos/planilla/:id", (req, res) =>
  repartoController.obtener(req, res),
);

app.put("/api/repartos/planilla/:id", (req, res) =>
  repartoController.actualizar(req, res),
);

app.put("/api/repartos/planilla/:id/cierre", (req, res) =>
  repartoController.cerrar(req, res),
);

app.get("/api/repartos/historial/:repartidorId", (req, res) =>
  repartoController.historial(req, res),
);

/* ==========================
   PRECIOS ESPECIALES
========================== */

app.get("/api/repartos/precios/:repartidorId", (req, res) =>
  repartoController.obtenerPreciosEspeciales(req, res),
);

app.post("/api/repartos/precios", (req, res) =>
  repartoController.guardarPreciosEspeciales(req, res),
);
/* ==========================
   SERVIDOR
========================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});

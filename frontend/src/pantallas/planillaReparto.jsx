import React, { useState, useEffect } from "react";
import Page from "../components/ui/Page";
import {
  crearPlanilla,
  actualizarPlanilla,
  cerrarPlanilla as cerrarPlanillaApi,
  obtenerPreciosEspeciales,
} from "../servicios/planillasApi";
import { listarRepartidores } from "../servicios/repartidoresApi";
import { listarProductos } from "../servicios/productosApi";
import PlanillaTable from "../components/repartos/PlanillaTable";
import PlanillaToolbar from "../components/repartos/PlanillaToolbar";
import Button from "../components/ui/Button";
import "./planillaReparto.css";

export default function PlanillaReparto() {
  // Datos maestros que traemos del backend
  const [repartidores, setRepartidores] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estado de la planilla actual en la pantalla
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState("");
  const [cantidadesLlevadas, setCantidadesLlevadas] = useState({}); // { productoId: cantidad }
  const [cantidadesDevueltas, setCantidadesDevueltas] = useState({}); // { productoId: cantidad }
  const [preciosRepartidor, setPreciosRepartidor] = useState({}); // { productoId: precio }
  const [ajustes, setAjustes] = useState({}); // Para sumas/restas rápidas

  // Control de flujo de la pantalla
  const [fase, setFase] = useState("SALIDA"); // 'SALIDA' (Mañana) o 'RETORNO' (Tarde)
  const [planillaCreadaId, setPlanillaCreadaId] = useState(null);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
  console.log("preciosRepartidor actualizado:", preciosRepartidor);
}, [preciosRepartidor]);

  useEffect(() => {
    const cargarDatosMaestros = async () => {
      try {
        const [reps, prods] = await Promise.all([
          listarRepartidores(),
          listarProductos(),
        ]);

        setRepartidores(reps);
        setProductos(prods);
      } catch (err) {
        alert("Error al cargar datos de logística.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosMaestros();
  }, []);

  // Cada vez que cambia el repartidor, buscamos sus precios específicos
  useEffect(() => {
    if (!repartidorSeleccionado) {
      setPreciosRepartidor({});
      return;
    }

    async function cargarPrecios() {
      try {
        const datos = await obtenerPreciosEspeciales(repartidorSeleccionado);

console.log("Respuesta API:", datos);

setPreciosRepartidor(datos);
      } catch (err) {
        console.error(err);

        setPreciosRepartidor({});
      }
    }

    cargarPrecios();
  }, [repartidorSeleccionado]);

  // Limpiar el estado al cambiar de repartidor para evitar que se mezclen los datos
  const manejarCambioRepartidor = (id) => {
    setRepartidorSeleccionado(id);
    setPlanillaCreadaId(null);
    setCantidadesLlevadas({});
    setCantidadesDevueltas({});
    setFase("SALIDA");
  };

  // Efecto para recuperar y continuar modificando una planilla del Historial
  useEffect(() => {
    if (productos.length === 0) return;

    const planillaGuardada = localStorage.getItem("planilla_a_cargar");
    if (planillaGuardada) {
      try {
        const planilla = JSON.parse(planillaGuardada);
        setPlanillaCreadaId(planilla.id);
        setRepartidorSeleccionado(
          planilla.repartidor_id || planilla.repartidorId,
        );

        const items = planilla.productos || planilla.items || [];
        const llevadas = {};
        const devueltas = {};

        items.forEach((item) => {
          const pId = item.productoId || item.producto_id;
          if (pId) {
            llevadas[pId] = item.cantidadLlevada ?? item.cantidad ?? 0;
            devueltas[pId] = item.cantidadDevuelta ?? 0;
          }
        });

        setCantidadesLlevadas(llevadas);
        setCantidadesDevueltas(devueltas);
        setFase(
          planilla.estado === "CERRADA"
            ? "RETORNO"
            : planilla.estado || "SALIDA",
        );
      } catch (err) {
        console.error("Error al rehidratar planilla:", err);
      } finally {
        localStorage.removeItem("planilla_a_cargar");
      }
    }
  }, [productos]);

  // Manejar el cambio en los inputs dinámicos de la tabla
  const manejarCambioCantidad = (productoId, valor, tipo) => {
    const cantidad = valor === "" ? 0 : parseFloat(valor);
    if (tipo === "llevada") {
      setCantidadesLlevadas((prev) => ({ ...prev, [productoId]: cantidad }));
    } else {
      setCantidadesDevueltas((prev) => ({ ...prev, [productoId]: cantidad }));
    }
  };

  // Función para sumar o restar mercadería durante el día
  const aplicarAjuste = (productoId, operacion) => {
    const valor = parseFloat(ajustes[productoId] || 0);
    if (valor <= 0) return;

    setCantidadesLlevadas((prev) => {
      const actual = prev[productoId] || 0;
      const nuevo =
        operacion === "sumar" ? actual + valor : Math.max(0, actual - valor);
      return { ...prev, [productoId]: nuevo };
    });

    // Limpiar el campo de ajuste
    setAjustes((prev) => ({ ...prev, [productoId]: "" }));
  };

  // 1. Despachar Reparto (Mañana)
  const registrarSalida = async () => {
    if (!repartidorSeleccionado) {
      alert("Seleccioná un repartidor.");
      return;
    }

    const itemsCargados = productos
      .filter((p) => cantidadesLlevadas[p.id] > 0)
      .map((p) => ({
        productoId: p.id,
        cantidad: cantidadesLlevadas[p.id],
      }));

    if (itemsCargados.length === 0) {
      alert("Debés cargar al menos un producto.");
      return;
    }

    try {
      let datos;

      if (planillaCreadaId) {
        datos = await actualizarPlanilla(planillaCreadaId, {
          repartidorId: repartidorSeleccionado,
          productos: itemsCargados,
        });
      } else {
        datos = await crearPlanilla({
          repartidorId: repartidorSeleccionado,
          productos: itemsCargados,
        });

        setPlanillaCreadaId(datos.id);
      }

      alert("Carga guardada correctamente.");
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. Rendición y Cierre de Planilla (Tarde)
  const cerrarPlanillaActual = async () => {
    try {
      const devoluciones = Object.entries(cantidadesDevueltas)
        .filter(([, cantidad]) => Number(cantidad) > 0)
        .map(([productoId, cantidad]) => ({
          productoId,
          cantidad: Number(cantidad),
        }));

      await cerrarPlanillaApi(planillaCreadaId, devoluciones);

      alert("¡Planilla cerrada correctamente!");

      setPlanillaCreadaId(null);
      setRepartidorSeleccionado("");
      setCantidadesLlevadas({});
      setCantidadesDevueltas({});
      setFase("SALIDA");
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando)
    return <p className="planilla-loading">Cargando planilla de control...</p>;

  return (
    <Page
      titulo="Planilla de Reparto"
      descripcion="Registrá la mercadería que se lleva y devuelve cada repartidor."
    >
      <PlanillaToolbar
        repartidores={repartidores}
        repartidorSeleccionado={repartidorSeleccionado}
        setRepartidorSeleccionado={manejarCambioRepartidor}
        fase={fase}
        planillaCreadaId={planillaCreadaId}
        abrirHistorial={() => (window.location.hash = "#historial")}
        abrirGestionPrecios={() => (window.location.hash = "#precios")}
      />

      {/* Tabla Dinámica de Mercadería */}
      <PlanillaTable
        productos={productos}
        fase={fase}
        cantidadesLlevadas={cantidadesLlevadas}
        cantidadesDevueltas={cantidadesDevueltas}
        preciosRepartidor={preciosRepartidor}
        ajustes={ajustes}
        manejarCambioCantidad={manejarCambioCantidad}
        setAjustes={setAjustes}
        aplicarAjuste={aplicarAjuste}
        setFase={setFase}
      />

      {/* Botones de Acción */}
      <div className="planilla-actions">
        <Button variant="primary" onClick={registrarSalida}>
          Registrar salida
        </Button>

        {planillaCreadaId && (
          <Button variant="success" onClick={cerrarPlanillaActual}>
            Cerrar planilla
          </Button>
        )}
      </div>
    </Page>
  );
}

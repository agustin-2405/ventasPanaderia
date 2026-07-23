import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  ClipboardList,
  Plus,
  Boxes,
  History,
} from "lucide-react";

import Page from "../components/ui/Page";
import StatCard from "../components/ui/StatCard";
import QuickAction from "../components/ui/QuickAction";
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [resProductos, resRepartidores] = await Promise.all([
        fetch("http://localhost:4000/api/productos"),
        fetch("http://localhost:4000/api/repartidores"),
      ]);

      if (resProductos.ok) setProductos(await resProductos.json());

      if (resRepartidores.ok) setRepartidores(await resRepartidores.json());
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Page
      titulo="Inicio"
      descripcion="Bienvenido al Sistema de Gestión de la Panadería."
    >
      <div style={estilos.estadisticas}>
        <StatCard titulo="Productos" valor={productos.length} icon={Package} />

        <StatCard
          titulo="Repartidores"
          valor={repartidores.length}
          icon={Truck}
          color="#2563EB"
        />

        <StatCard
          titulo="Planillas"
          valor="-"
          icon={ClipboardList}
          color="#16A34A"
        />
      </div>

      <Section titulo="Accesos rápidos">
        <div style={estilos.acciones}>
          <QuickAction
            titulo="Nuevo Producto"
            icon={Plus}
            onClick={() => {
              window.location.hash = "#productos";
            }}
          />

          <QuickAction
            titulo="Repartidores"
            icon={Truck}
            onClick={() => {
              window.location.hash = "#repartidores";
            }}
          />

          <QuickAction
            titulo="Historial"
            icon={History}
            onClick={() => {
              window.location.hash = "#historial";
            }}
          />
        </div>
      </Section>

      <Section titulo="Actividad reciente">
        <Card>
          <div style={estilos.itemActividad}>
            <div style={estilos.iconoActividad}>
              <Package size={18} />
            </div>

            <span>Productos registrados: {productos.length}</span>
          </div>

          <div style={estilos.itemActividad}>
            <div style={estilos.iconoActividad}>
              <Truck size={18} />
            </div>

            <span>Repartidores registrados: {repartidores.length}</span>
          </div>

          <div style={estilos.itemActividad}>
            <div style={estilos.iconoActividad}>
              <ClipboardList size={18} />
            </div>

            <span>Próximamente aparecerán aquí las últimas planillas.</span>
          </div>
        </Card>
      </Section>
    </Page>
  );
}

const estilos = {
  estadisticas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
  },

  acciones: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 16,
  },

  actividad: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  itemActividad: {
    display: "flex",
    alignItems: "center",
    color: "#374151",
    fontSize: 15,
    padding: "8px 0",
  },

  iconoActividad: {
    width: 24,
    minWidth: 24,
    display: "flex",
    justifyContent: "center",
    marginRight: 10,
  },
};

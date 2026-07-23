import { useEffect, useState } from "react";
import {
  Home,
  Package,
  Truck,
  ClipboardList,
  History,
  DollarSign,
  Menu,
  X,
} from "lucide-react";

import SidebarSection from "./SidebarSection";
import logo from "../../assets/WhatsApp Image 2026-07-04 at 12.34.40.jpeg";

import "../../styles/sidebar.css";

const menu = [
  {
    titulo: "GENERAL",
    items: [
      {
        texto: "Inicio",
        icono: Home,
        ruta: "#",
      },
    ],
  },
  {
    titulo: "INVENTARIO",
    items: [
      {
        texto: "Productos",
        icono: Package,
        ruta: "#productos",
      },
    ],
  },
  {
    titulo: "REPARTOS",
    items: [
      {
        texto: "Repartidores",
        icono: Truck,
        ruta: "#repartidores",
      },
      {
        texto: "Planilla",
        icono: ClipboardList,
        ruta: "#reparto",
      },
      {
        texto: "Historial",
        icono: History,
        ruta: "#historial",
      },
      {
        texto: "Precios",
        icono: DollarSign,
        ruta: "#precios",
      },
    ],
  },
];

export default function Sidebar() {
  const rutaActual = window.location.hash || "#";

  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const resize = () => {
      setMobile(window.innerWidth <= 768);

      // Si vuelve a escritorio, cerramos el menú móvil
      if (window.innerWidth > 768) {
        setAbierto(false);
      }
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      {mobile && abierto && (
        <div className="sidebar-overlay" onClick={() => setAbierto(false)} />
      )}

      {mobile && (
        <button className="sidebar-toggle" onClick={() => setAbierto(!abierto)}>
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <aside className={`sidebar ${abierto ? "open" : ""}`}>
        <div>
          <div className="sidebar-logo">
            <img src={logo} alt="El Pan de Cada Día" />
          </div>

          <div className="sidebar-menu">
            {menu.map((grupo) => (
              <SidebarSection
                key={grupo.titulo}
                titulo={grupo.titulo}
                items={grupo.items}
                rutaActual={rutaActual}
                onItemClick={() => {
                  if (mobile) {
                    setAbierto(false);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

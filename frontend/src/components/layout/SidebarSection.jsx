import SidebarItem from "./SidebarItem";

export default function SidebarSection({
  titulo,
  items,
  rutaActual,
  onItemClick,
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={estilos.titulo}>
        {titulo}
      </p>

      {items.map((item) => (
        <SidebarItem
          key={item.ruta}
          icon={item.icono}
          texto={item.texto}
          ruta={item.ruta}
          activo={rutaActual === item.ruta}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}

const estilos = {
  titulo: {
    color: "#7b7f87",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
};
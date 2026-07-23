export default function SidebarItem({
  icon: Icon,
  texto,
  ruta,
  activo,
  onClick,
}) {
  return (
    <a
      href={ruta}
      className={`sidebar-item ${activo ? "active" : ""}`}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{texto}</span>
    </a>
  );
}
import API from "./api";
import { obtenerConCache, limpiarCache } from "./cache";

export async function listarRepartidores() {
  return obtenerConCache("repartidores", 60, async () => {
    const res = await fetch(`${API}/repartidores`);

    const datos = await res.json();

    if (!res.ok) {
      throw new Error(
        datos.error || "No se pudo obtener la lista de repartidores.",
      );
    }

    return datos;
  });
}

export async function crearRepartidor(repartidor) {
  const res = await fetch(`${API}/repartidores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repartidor),
  });

  const datos = await res.json();

  if (!res.ok) {
    throw new Error(datos.error || "No se pudo registrar el repartidor.");
  }

  // El listado quedó desactualizado, lo borramos
  limpiarCache("repartidores");

  return datos;
}

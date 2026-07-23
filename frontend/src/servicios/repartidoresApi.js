import API from "./api";

export async function listarRepartidores() {
  const res = await fetch(`${API}/repartidores`);

  const datos = await res.json();

  if (!res.ok) {
    throw new Error(
      datos.error || "No se pudo obtener la lista de repartidores."
    );
  }

  return datos;
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
    throw new Error(
      datos.error || "No se pudo registrar el repartidor."
    );
  }

  return datos;
}
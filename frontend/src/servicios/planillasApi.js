import API from "./api";

/* ==========================
   PLANILLAS
========================== */

export async function crearPlanilla(datos) {
  const res = await fetch(`${API}/repartos/planilla`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo crear la planilla.");
  }

  return json;
}

export async function actualizarPlanilla(id, datos) {
  const res = await fetch(`${API}/repartos/planilla/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo actualizar la planilla.");
  }

  return json;
}

export async function obtenerPlanilla(id) {
  const res = await fetch(`${API}/repartos/planilla/${id}`);

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo obtener la planilla.");
  }

  return json;
}

export async function cerrarPlanilla(id, devoluciones) {
  const res = await fetch(`${API}/repartos/planilla/${id}/cierre`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      devoluciones,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo cerrar la planilla.");
  }

  return json;
}

/* ==========================
   HISTORIAL
========================== */

export async function obtenerHistorial(repartidorId) {
  const res = await fetch(
    `${API}/repartos/historial/${repartidorId}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo obtener el historial.");
  }

  return json;
}

/* ==========================
   PRECIOS ESPECIALES
========================== */

export async function obtenerPreciosEspeciales(repartidorId) {
  const res = await fetch(
    `${API}/repartos/precios/${repartidorId}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudieron obtener los precios.");
  }

  return json;
}

export async function guardarPreciosEspeciales(datos) {
  const res = await fetch(`${API}/repartos/precios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudieron guardar los precios.");
  }

  return json;
}
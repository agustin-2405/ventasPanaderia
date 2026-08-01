const CACHE_PREFIX = "panaderia_cache_";

export function guardarCache(clave, datos, minutos = 60) {
  const contenido = {
    datos,
    vence: Date.now() + minutos * 60 * 1000,
  };

  localStorage.setItem(CACHE_PREFIX + clave, JSON.stringify(contenido));
}

export function obtenerCache(clave) {
  const guardado = localStorage.getItem(CACHE_PREFIX + clave);

  if (!guardado) return null;

  try {
    const contenido = JSON.parse(guardado);

    if (Date.now() > contenido.vence) {
      localStorage.removeItem(CACHE_PREFIX + clave);
      return null;
    }

    return contenido.datos;
  } catch {
    localStorage.removeItem(CACHE_PREFIX + clave);
    return null;
  }
}

export function limpiarCache(clave) {
  localStorage.removeItem(CACHE_PREFIX + clave);
}

export function limpiarTodoElCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

export async function obtenerConCache(clave, minutos, obtenerDatos) {
  const cache = obtenerCache(clave);

  if (cache) {
    // Devuelve el caché inmediatamente
    // y actualiza en segundo plano
    obtenerDatos()
      .then((datos) => guardarCache(clave, datos, minutos))
      .catch(() => {});

    return cache;
  }

  // Si no hay caché, consulta al servidor
  const datos = await obtenerDatos();

  guardarCache(clave, datos, minutos);

  return datos;
}

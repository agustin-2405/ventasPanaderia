import API from "./api";
import { obtenerConCache, limpiarCache } from "./cache";

/* ==========================
   PRODUCTOS
========================== */

export async function listarProductos() {
  return obtenerConCache("productos", 60, async () => {
    const res = await fetch(`${API}/productos`);

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "No se pudieron obtener los productos.");
    }

    return json;
  });
}

export async function crearProducto(producto) {
  const res = await fetch(`${API}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  const datos = await res.json();

  if (!res.ok) {
    throw new Error(datos.error || "Error al crear producto.");
  }

  limpiarCache("productos");

  return datos;
}

/* ==========================
   ACTUALIZAR PRODUCTO
========================== */

export async function actualizarProducto(id, datos) {
  const res = await fetch(`${API}/productos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo actualizar el producto.");
  }

  limpiarCache("productos");

  return json;
}

/* ==========================
   ELIMINAR PRODUCTO
========================== */

export async function eliminarProducto(id) {
  const res = await fetch(`${API}/productos/${id}`, {
    method: "DELETE",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "No se pudo eliminar el producto.");
  }

  limpiarCache("productos");

  return json;
}

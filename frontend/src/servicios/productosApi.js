import API from "./api";

/* ==========================
   PRODUCTOS
========================== */

export async function listarProductos() {
  const res = await fetch(`${API}/productos`);

  if (!res.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  return res.json();
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

  return json;
}

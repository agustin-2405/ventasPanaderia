import { useState, useEffect } from "react";
import Page from "../components/ui/Page";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import EditarProductoModal from "../components/productos/EditarProductoModal";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../servicios/productosApi";
import "./altaProducto.css";

import { exito, error, confirmar } from "../servicios/notificaciones";
import { Pencil, Trash2 } from "lucide-react";

export default function AltaProductos() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockInicial, setStockInicial] = useState("");
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");

  async function obtenerProductos() {
    try {
      const datos = await listarProductos();
      setProductos(datos);
    } catch (err) {
      error("Error", err.message);
    }
  }

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombre || Number(precio) <= 0) {
      error("Datos inválidos", "Por favor, completa los campos correctamente.");
      return;
    }

    setCargando(true);

    try {
      const datos = await crearProducto({
        nombre,
        precio: Number(precio),
        stockInicial: stockInicial ? Number(stockInicial) : 0,
      });

      exito("Producto registrado", `${datos.nombre} registrado correctamente.`);

      await obtenerProductos();

      setNombre("");
      setPrecio("");
      setStockInicial("");
    } catch (e) {
      error("Error", e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  function editarProducto(producto) {
    setProductoEditando(producto);
    setNuevoNombre(producto.nombre);
    setNuevoPrecio(producto.precio);
    setModalAbierto(true);
  }

  async function guardarProducto() {
    if (!productoEditando) return;

    if (!nuevoNombre.trim()) {
      error("Nombre inválido", "Ingresá un nombre.");
      return;
    }

    if (Number(nuevoPrecio) <= 0) {
      error("Precio inválido", "Ingresá un precio mayor que cero.");
      return;
    }

    try {
      const productoActualizado = await actualizarProducto(
        productoEditando.id,
        {
          nombre: nuevoNombre,
          precio: Number(nuevoPrecio),
        },
      );

      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === productoActualizado.id
            ? productoActualizado
            : producto,
        ),
      );

      exito(
        "Producto actualizado",
        `${productoActualizado.nombre} fue actualizado correctamente.`,
      );

      setModalAbierto(false);
      setProductoEditando(null);
      setNuevoNombre("");
      setNuevoPrecio("");
    } catch (err) {
      error("No se pudo actualizar", err.message);
    }
  }

  async function eliminar(producto) {
    const respuesta = await confirmar({
      titulo: "¿Eliminar producto?",
      texto: `"${producto.nombre}" será eliminado permanentemente.`,
      botonConfirmar: "Eliminar",
    });

    if (!respuesta.isConfirmed) return;

    try {
      await eliminarProducto(producto.id);

      setProductos((prev) => prev.filter((p) => p.id !== producto.id));

      exito(
        "Producto eliminado",
        `${producto.nombre} fue eliminado correctamente.`,
      );
    } catch (err) {
      error("No se pudo eliminar", err.message);
    }
  }

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <Page
      titulo="Administración de Productos"
      descripcion="Registrá nuevos productos y administrá sus precios."
    >
      <Card
        titulo="Nuevo producto"
        subtitulo="Completá los datos para agregar un producto."
      >
        <form onSubmit={manejarEnvio} className="productos-form">
          <Input
            label="Nombre del producto"
            placeholder="Ej: Pan Casero"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
            required
          />

          <Input
            label="Precio de venta ($)"
            type="number"
            step="0.01"
            placeholder="1500"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={cargando}
            required
          />

          <div className="productos-actions">
            <Button type="submit" variant="primary" disabled={cargando}>
              {cargando ? "Guardando..." : "Registrar producto"}
            </Button>
          </div>
        </form>
      </Card>

      <Card
        titulo="Productos registrados"
        subtitulo="Administrá los productos cargados."
      >
        <Table
          columns={[
            {
              key: "nombre",
              title: "Producto",
            },
            {
              key: "precio",
              title: "Precio",
              align: "right",
              render: (p) => `$${Number(p.precio).toLocaleString("es-AR")}`,
            },
          ]}
          data={productos}
          emptyMessage="No hay productos registrados."
          renderActions={(producto) => (
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <Button
                size="small"
                variant="secondary"
                onClick={() => editarProducto(producto)}
              >
                <Pencil size={16} />
              </Button>

              <Button
                size="small"
                variant="danger"
                onClick={() => eliminar(producto)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        />
      </Card>
      <EditarProductoModal
        abierto={modalAbierto}
        producto={productoEditando}
        nombre={nuevoNombre}
        setNombre={setNuevoNombre}
        precio={nuevoPrecio}
        setPrecio={setNuevoPrecio}
        onCancelar={() => {
          setModalAbierto(false);
          setProductoEditando(null);
          setNuevoNombre("");
          setNuevoPrecio("");
        }}
        onGuardar={guardarProducto}
      />
    </Page>
  );
}

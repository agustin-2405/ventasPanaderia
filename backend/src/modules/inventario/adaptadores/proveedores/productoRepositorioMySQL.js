const pool = require('../../../../config/database');

class ProductoRepositorioMySQL {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async findByNombre(nombre) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE nombre = ?', [nombre]);
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
  }

  async save(producto) {
    const [exists] = await pool.query('SELECT id FROM productos WHERE id = ?', [producto.id]);
    
    if (exists.length > 0) {
      await pool.query(
        'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
        [producto.nombre, producto.precio, producto.stock, producto.id]
      );
    } else {
      await pool.query(
        'INSERT INTO productos (id, nombre, precio, stock) VALUES (?, ?, ?, ?)',
        [producto.id, producto.nombre, producto.precio, producto.stock]
      );
    }
  }
}

module.exports = new ProductoRepositorioMySQL();
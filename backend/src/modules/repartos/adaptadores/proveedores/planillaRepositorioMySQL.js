const pool = require('../../../../config/database');

class PlanillaRepositorioMySQL {
  async findById(id) {
    const [planillaRows] = await pool.query('SELECT * FROM planillas WHERE id = ?', [id]);
    if (planillaRows.length === 0) return null;

    const [itemRows] = await pool.query('SELECT * FROM planilla_items WHERE planillaId = ?', [id]);
    
    return {
      ...planillaRows[0],
      items: itemRows
    };
  }

  async save(planilla) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Guardar o actualizar la cabecera de la planilla
      await connection.query(
        `INSERT INTO planillas (id, repartidorId, fecha, estado) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE estado = ?`,
        [planilla.id, planilla.repartidorId, planilla.fecha, planilla.estado, planilla.estado]
      );

      // 2. Limpiar items anteriores para evitar duplicados en la actualización
      await connection.query('DELETE FROM planilla_items WHERE planillaId = ?', [planilla.id]);

      // 3. Insertar los items actuales
      if (planilla.items.length > 0) {
        const values = planilla.items.map(item => [
          planilla.id,
          item.productoId,
          item.cantidadLlevada,
          item.cantidadDevuelta,
          item.cantidadVendida
        ]);

        await connection.query(
          'INSERT INTO planilla_items (planillaId, productoId, cantidadLlevada, cantidadDevuelta, cantidadVendida) VALUES ?',
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PlanillaRepositorioMySQL();
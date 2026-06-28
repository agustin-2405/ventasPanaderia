const supabase = require('../../../../supabaseClient');

const productoRepositorioSupabase = {
  async save(producto) {
    const { data, error } = await supabase
      .from('productos')
      .insert([
        {
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          // Si tienes otras columnas como 'created_at', Supabase las manejará automáticamente si están configuradas con DEFAULT NOW()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async listar() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data;
  },

  async findByNombre(nombre) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('nombre', nombre)
      .single(); // .single() espera 1 resultado o da error.

    // Si el error es que no encontró filas (PGRST116), devolvemos null, que es lo esperado.
    // Cualquier otro error, lo lanzamos.
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStock(productoId, newStock) {
    const { data, error } = await supabase
      .from('productos')
      .update({ stock: newStock })
      .eq('id', productoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

module.exports = productoRepositorioSupabase;
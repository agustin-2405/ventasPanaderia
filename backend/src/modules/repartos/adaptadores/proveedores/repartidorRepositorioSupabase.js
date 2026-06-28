const supabase = require('../../../../supabaseClient');

const repartidorRepositorioSupabase = {
  async save(repartidor) {
    const { data, error } = await supabase
      .from('repartidores')
      .insert([repartidor]) // Recibe { nombre, telefono, vehiculo }
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('repartidores')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data;
  }
};

module.exports = repartidorRepositorioSupabase;
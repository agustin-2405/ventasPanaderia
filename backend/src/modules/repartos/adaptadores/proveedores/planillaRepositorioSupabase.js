const supabase = require('../../../../supabaseClient');

class PlanillaRepositorioSupabase {
  async save(planilla) {
    // Guardamos la cabecera de la planilla
    const { data, error } = await supabase.from('planillas').upsert({
      id: planilla.id,
      repartidor_id: planilla.repartidorId,
      estado: planilla.estado,
      fecha: planilla.fecha,
      productos: planilla.productos || planilla.items // Guardamos el JSON de productos
    }).select().single();

    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase.from('planillas').select('*').eq('id', id).single();
    if (error) return null;
    // Mapeamos de snake_case (DB) a camelCase (JS)
    return { ...data, repartidorId: data.repartidor_id };
  }
}

module.exports = new PlanillaRepositorioSupabase();
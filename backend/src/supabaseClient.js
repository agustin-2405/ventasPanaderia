const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const WebSocket = require('ws');

// Aseguramos que dotenv busque el archivo en la carpeta backend, sin importar desde dónde lances el proceso
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
// En el backend es preferible usar SERVICE_ROLE_KEY para omitir las restricciones RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu_url')) {
  throw new Error("❌ Error: SUPABASE_URL o SUPABASE_ANON_KEY no están configuradas correctamente en el archivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: WebSocket,
  },
});

module.exports = supabase;
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('address_details').select('*').limit(1);
  if (error) console.log('address_details error:', error.message);
  else console.log('address_details exists, data:', data);
  
  const { data: d2, error: e2 } = await supabase.from('addresses').select('*').limit(1);
  if (e2) console.log('addresses error:', e2.message);
  else console.log('addresses exists, data:', d2);
}

checkSchema();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('addresses').select('*').limit(1);
  if (error) {
    console.log('addresses error:', error.message);
    const { data: d2, error: e2 } = await supabase.from('address').select('*').limit(1);
    if (e2) console.log('address error:', e2.message);
    else console.log('address exists, data:', d2);
  } else {
    console.log('addresses exists, data:', data);
  }
}

checkSchema();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAddress() {
  const { data, error } = await supabase.from('address').select('*');
  console.log(data);
}

fetchAddress();

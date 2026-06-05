const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('address').insert([{ 
    test_col: 1 
  }]);
  console.log('insert error:', error);
}

checkSchema();

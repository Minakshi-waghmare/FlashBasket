const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('cart_items').select('cart_id, product_id, quantity').limit(1);
  if (error) console.log('cart_items error:', error.message);
  else console.log('cart_items has cart_id, product_id, quantity');
}

checkSchema();

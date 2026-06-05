const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // We can try to query a few table names to see if they exist
  const tables = ['carts', 'cart_items', 'cart_item', 'CartItems', 'wishlist'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table} error:`, error.message);
    } else {
      console.log(`Table ${table} exists! Data:`, data);
    }
  }
}

checkSchema();

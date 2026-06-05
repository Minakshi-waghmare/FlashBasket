const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const tables = ['carts', 'cart_items'];
  for (const table of tables) {
    // Insert a dummy record that is guaranteed to fail so we can get the error or we just do an rpc if we had it, but supabase doesn't easily expose schema.
    // Let's just try to insert an empty object to see what column error we get, or select with non-existent column.
    console.log(`Checking ${table}...`);
    const { error } = await supabase.from(table).select('non_existent_column_123').limit(1);
    if (error) console.log(error.message);
  }
}

checkSchema();

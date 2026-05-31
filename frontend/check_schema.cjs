const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const tables = ['carts', 'cart_items'];
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

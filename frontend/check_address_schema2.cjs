const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('address').insert([{ 
    test_col: 1 
  }]);
  console.log('insert error:', error);
}

checkSchema();

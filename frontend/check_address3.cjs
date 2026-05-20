const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';

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

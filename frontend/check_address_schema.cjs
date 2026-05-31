const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';

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

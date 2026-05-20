import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error } = await supabase.from('cart').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', product_id: 1, quantity: 1 }]);
  console.log('Cart Insert Error:', error);

  const { error: error2 } = await supabase.from('wishlist').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', product_id: 1 }]);
  console.log('Wishlist Insert Error:', error2);
}

test();

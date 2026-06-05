import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error } = await supabase.from('cart').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', product_id: 1, quantity: 1 }]);
  console.log('Cart Insert Error:', error);

  const { error: error2 } = await supabase.from('wishlist').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', product_id: 1 }]);
  console.log('Wishlist Insert Error:', error2);
}

test();

import { supabase } from './supabase';

export const addToCartLogic = async (user, productId, quantity = 1) => {
  if (!user) throw new Error("Please login to add items to your cart.");
  
  // Fetch or create public DB user record to get the bigint user_id
  let dbUserId = null;
  try {
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    if (!dbUser) {
      const { data: newUser } = await supabase
        .from('users')
        .insert([{
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'customer'
        }])
        .select('id')
        .maybeSingle();
      dbUserId = newUser ? newUser.id : null;
    } else {
      dbUserId = dbUser.id;
    }
  } catch (dbErr) {
    console.error("Error fetching public DB user in cart service:", dbErr);
  }

  if (!dbUserId) {
    throw new Error("Could not find or sync your profile in the database. Please reload the page or sign out and sign in again.");
  }

  // 1. Check if user has an address saved (using bigint user_id)
  let addressQuery = supabase.from('address').select('id');
  addressQuery = addressQuery.eq('user_id', dbUserId);
  const { data: addresses, error: addressError } = await addressQuery;
     
  if (addressError) throw addressError;
  if (!addresses || addresses.length === 0) {
    throw new Error("ADDRESS_REQUIRED");
  }
  
  // 2. Get or create cart for user
  let { data: userCarts, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', dbUserId);
     
  if (cartError) throw cartError;
  
  let cartId = userCarts && userCarts.length > 0 ? userCarts[0].id : null;
  
  if (!cartId) {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert([{ user_id: dbUserId }])
      .select();
    if (newCartError) throw newCartError;
    cartId = newCart[0].id;
  }
  
  // 3. Check if product already in cart_items
  const { data: existingItems, error: itemsError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId);
    
  if (itemsError) throw itemsError;
  
  const existingItem = existingItems && existingItems.length > 0 ? existingItems[0] : null;
  
  if (existingItem) {
    // Update quantity
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
    if (updateError) throw updateError;
  } else {
    // Insert new item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([{ cart_id: cartId, product_id: productId, quantity }]);
    if (insertError) throw insertError;
  }
};

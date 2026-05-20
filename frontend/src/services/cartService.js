import { supabase } from './supabase';

export const addToCartLogic = async (user, productId, quantity = 1) => {
  if (!user) throw new Error("Please login to add items to your cart.");
  
  // 1. Check if user has an address saved
  const { data: addresses, error: addressError } = await supabase
    .from('address')
    .select('id')
    .eq('user_id', user.id);
    
  if (addressError) throw addressError;
  if (!addresses || addresses.length === 0) {
    throw new Error("ADDRESS_REQUIRED");
  }
  
  // 2. Get or create cart for user
  let { data: userCarts, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id);
    
  if (cartError) throw cartError;
  
  let cartId = userCarts && userCarts.length > 0 ? userCarts[0].id : null;
  
  if (!cartId) {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert([{ user_id: user.id }])
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

import React, { useState, useEffect } from 'react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchCart();
  }, []);

  const checkUserAndFetchCart = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
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
          console.error("Error fetching/syncing public DB user in Cart:", dbErr);
        }

        // Fetch cart for this user using bigint id
        let cartQuery = supabase.from('carts').select('id');
        if (dbUserId) {
          cartQuery = cartQuery.eq('user_id', dbUserId);
        } else {
          cartQuery = cartQuery.eq('user_id', 0);
        }
        let { data: userCarts, error: cartError } = await cartQuery;

        if (cartError) throw cartError;

        let cartId = userCarts && userCarts.length > 0 ? userCarts[0].id : null;
        
        if (!cartId) {
            const { data: newCart, error: newCartError } = await supabase
              .from('carts')
              .insert([{ user_id: dbUserId || 0 }])
              .select();
            if (newCartError) throw newCartError;
            cartId = newCart[0].id;
        }

        const { data: cartData, error: itemsError } = await supabase
          .from('cart_items')
          .select('id, product_id, quantity')
          .eq('cart_id', cartId);

        if (itemsError) throw itemsError;

        if (cartError) throw cartError;

        if (cartData && cartData.length > 0) {
          const productIds = cartData.map(item => item.product_id);

          // Fetch the product details
          const { data: productsData, error: productsError } = await supabase
            .from('product')
            .select('*')
            .in('id', productIds);

          if (productsError) throw productsError;

          // Merge product details with cart quantity
          const mergedCart = cartData.map(cartItem => {
            const product = productsData.find(p => p.id === cartItem.product_id);
            return {
              ...product,
              cartItemId: cartItem.id, // Primary key of the cart table
              quantity: cartItem.quantity
            };
          }).filter(item => item.name); // Filter out any items where product wasn't found

          setCartItems(mergedCart);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Optimistic UI update
    setCartItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ));

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) {
        console.error("Error updating quantity:", error);
        checkUserAndFetchCart(); // Revert on failure
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    // Optimistic update
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
        
      if (error) {
        console.error("Error removing from cart:", error);
        checkUserAndFetchCart(); // Revert on failure
      } else {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setCartItems([]); // Optimistic
    
    try {
      // Fetch public DB user record to get the bigint user_id
      let dbUserId = null;
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();
        if (dbUser) dbUserId = dbUser.id;
      } catch (dbErr) {
        console.error("Error fetching dbUser for clearCart:", dbErr);
      }

      // First find cart_id using bigint id
      let cartQuery = supabase.from('carts').select('id');
      if (dbUserId) {
        cartQuery = cartQuery.eq('user_id', dbUserId);
      } else {
        cartQuery = cartQuery.eq('user_id', 0);
      }
      const { data: userCarts } = await cartQuery;

      if (userCarts && userCarts.length > 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', userCarts[0].id);
          
        if (error) {
          console.error("Error clearing cart:", error);
          checkUserAndFetchCart(); // Revert
        } else {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-500">Loading your cart...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100 my-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Please Log In</h2>
        <p className="text-lg text-slate-500 mb-8">You need to be logged in to view your shopping cart.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  // Calculate totals dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // Assume 5% tax
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="flex justify-center mb-6">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-slate-800">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
                <button onClick={clearCart} className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-lg">Clear Cart</button>
              </div>
              
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 transition-colors">
                    <Link to={`/product/${item.id}`} className="w-24 h-24 bg-white border border-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden hover:shadow-md transition-shadow">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                       ) : (
                         <span className="text-xs text-slate-400">No Image</span>
                       )}
                    </Link>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-bold text-slate-800 mb-1 hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                      </Link>
                      <p className="text-xs text-orange-500 font-bold mb-2 uppercase tracking-wider">{item.category}</p>
                      <span className="font-bold text-slate-900 text-xl">₹{item.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center border-2 border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-3 py-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 font-bold text-slate-900 border-x-2 border-slate-100">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-3 py-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Shipping</span>
                  <span className="font-bold text-green-500 tracking-wide">FREE</span>
                </div>
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-slate-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-black text-orange-500">₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center text-lg mb-4">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/" className="w-full block text-center text-slate-500 hover:text-slate-800 font-semibold transition-colors py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

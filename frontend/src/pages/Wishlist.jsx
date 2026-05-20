import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { addToCartLogic } from '../services/cartService';

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dbUserId, setDbUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchWishlist();
  }, []);

  const checkUserAndFetchWishlist = async () => {
    try {
      setLoading(true);
      // Get current logged in user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch or create public DB user record to get the bigint user_id
        let currentDbUserId = null;
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
            currentDbUserId = newUser ? newUser.id : null;
          } else {
            currentDbUserId = dbUser.id;
          }
          setDbUserId(currentDbUserId);
        } catch (dbErr) {
          console.error("Error fetching/syncing public DB user in Wishlist:", dbErr);
        }

        // Fetch wishlist entries for this user using bigint id
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', currentDbUserId || 0);

        if (wishlistError) throw wishlistError;

        if (wishlistData && wishlistData.length > 0) {
          const productIds = wishlistData.map(item => item.product_id);

          // Fetch the actual product details for these IDs
          const { data: productsData, error: productsError } = await supabase
            .from('product')
            .select('*')
            .in('id', productIds);

          if (productsError) throw productsError;
          setWishlistProducts(productsData || []);
        } else {
          setWishlistProducts([]);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    
    try {
      // Optimistic UI update
      setWishlistProducts(prev => prev.filter(p => p.id !== productId));
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', dbUserId || 0)
        .eq('product_id', productId);
        
      if (error) {
        console.error("Error removing from wishlist:", error);
        // Refresh to get true state if it failed
        checkUserAndFetchWishlist();
      } else {
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;
    
    try {
      setWishlistProducts([]); // Optimistic update
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', dbUserId || 0);
        
      if (error) {
        console.error("Error clearing wishlist:", error);
        checkUserAndFetchWishlist();
      } else {
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await addToCartLogic(user, productId);
      
      window.showToast?.("Added to cart successfully!", "success");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      if (err.message === "ADDRESS_REQUIRED") {
        window.showToast?.("Please save a delivery address before adding products to your cart.", "warning");
        window.location.href = '/checkout';
        return;
      }
      console.error("Error adding to cart:", err);
      window.showToast?.("Could not add to cart. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-500">Loading Wishlist...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100 my-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Please Log In</h2>
        <p className="text-lg text-slate-500 mb-8">You need to be logged in to view and manage your wishlist.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added any products to your wishlist yet.</p>
          <Link to="/" className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="font-bold text-slate-800">{wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}</span>
            <button 
              onClick={clearWishlist}
              className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Clear Wishlist
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {wishlistProducts.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 transition-colors group">
                <Link to={`/product/${item.id}`} className="w-32 h-32 bg-white border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </Link>
                
                <div className="flex-grow text-center sm:text-left">
                  <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category || 'Product'}</p>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-black text-2xl text-slate-900">₹{item.price}</span>
                    {item.original_price && (
                      <span className="font-semibold text-slate-400 line-through">₹{item.original_price}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <button 
                    onClick={(e) => addToCart(e, item.id)}
                    className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-orange-500/25 transition-all active:scale-95 flex items-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

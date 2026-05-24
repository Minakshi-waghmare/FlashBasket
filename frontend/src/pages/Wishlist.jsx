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

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      let currentDbUserId = null;

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

        currentDbUserId = newUser?.id || null;
      } else {
        currentDbUserId = dbUser.id;
      }

      setDbUserId(currentDbUserId);

      if (!currentDbUserId) {
        console.error("User ID missing");
        setWishlistProducts([]);
        return;
      }

      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', currentDbUserId);

      if (wishlistError) throw wishlistError;

      if (!wishlistData || wishlistData.length === 0) {
        setWishlistProducts([]);
        return;
      }

      const productIds = wishlistData.map(item => item.product_id);

      const { data: productsData, error: productsError } = await supabase
        .from('product')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      // ✅ IMAGE FIX HERE (VERY IMPORTANT)
      const formatted = (productsData || []).map(p => ({
        ...p,
        imageUrl: p.imageUrl || p.image || p.image_url || ''
      }));

      setWishlistProducts(formatted);

    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!dbUserId) return;

    setWishlistProducts(prev => prev.filter(p => p.id !== productId));

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', dbUserId)
      .eq('product_id', productId);

    if (error) {
      console.error(error);
      checkUserAndFetchWishlist();
    }
  };

  const clearWishlist = async () => {
    if (!dbUserId) return;

    setWishlistProducts([]);

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', dbUserId);

    if (error) {
      console.error(error);
      checkUserAndFetchWishlist();
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();

    if (!user) return;

    try {
      await addToCartLogic(user, productId);
      window.showToast?.("Added to cart!", "success");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      window.showToast?.("Failed to add to cart", "error");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading Wishlist...</h2>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <h2>Please login first</h2>
        <button onClick={() => navigate('/login')} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-12 text-center">

          {/* Heart Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Your wishlist is empty
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 mb-8">
            Tap the ❤️ icon on products you like to save them here
          </p>

          {/* Button */}
          <Link
            to="/"
            className="inline-block bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md"
          >
            Start Shopping
          </Link>

        </div>
      ) : (
        <div className="space-y-6">
          {wishlistProducts.map((item) => (
            <div key={item.id} className="flex gap-6 items-center border p-4 rounded-xl">

              {/* IMAGE FIXED */}
              <Link to={`/product/${item.id}`}>
                <div className="w-28 h-28 border rounded-xl overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={
                        item.imageUrl.startsWith('http')
                          ? item.imageUrl
                          : `http://localhost:8081/${item.imageUrl}`
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              </Link>

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p>₹{item.price}</p>
              </div>

              {/* ACTIONS */}
              <button
                onClick={(e) => addToCart(e, item.id)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                <ShoppingCart className="inline w-4 h-4 mr-1" />
                Add
              </button>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="text-red-500"
              >
                <Trash2 />
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
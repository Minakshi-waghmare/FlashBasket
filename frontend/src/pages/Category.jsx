import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Filter, ChevronDown, Heart } from 'lucide-react';
import { supabase } from '../services/supabase';
import { addToCartLogic } from '../services/cartService';
import api from '../services/api';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Format category name for display comparisons (e.g. 'home-kitchen' -> 'Home & Kitchen' or 'Home Kitchen')
  let displayTitle = categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  if (categoryName === 'home-kitchen') displayTitle = 'Home & Kitchen';

  useEffect(() => {
    fetchCategoryProducts();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [categoryName]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      // Request products directly through the category relationship route
      const res = await api.get(`/categories/name/${categoryName}/products`);

      if (res.data) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error loading category products via mapped relations:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      window.showToast?.("Please login to add items to your wishlist.", "info");
      return;
    }

    try {
      let dbUserId = null;
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();
        if (dbUser) {
          dbUserId = dbUser.id;
        } else {
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
        }
      } catch (dbErr) {
        console.error("Error fetching dbUserId in Category:", dbErr);
      }

      if (!dbUserId) {
        window.showToast?.("Could not sync your user account.", "error");
        return;
      }

      const { error } = await supabase
        .from('wishlist')
        .insert([{ user_id: dbUserId, product_id: productId }]);

      if (error) {
        if (error.code === '23505') {
          window.showToast?.("This item is already in your wishlist!", "warning");
        } else {
          window.showToast?.("Could not add to wishlist.", "error");
        }
      } else {
        window.showToast?.("Added to wishlist successfully!", "success");
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      window.showToast?.("Please login to add items to your cart.", "info");
      return;
    }

    try {
      await addToCartLogic(user, productId);
      window.showToast?.("Added to cart successfully!", "success");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      if (err.message === "ADDRESS_REQUIRED") {
        window.location.href = '/checkout';
        return;
      }
      window.showToast?.("Could not add to cart.", "error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{displayTitle}</h1>
            <p className="text-slate-500">Explore all products in {displayTitle}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 flex-grow md:justify-end">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors">
                <Filter className="w-4 h-4" /> Filters
              </button>
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors">
                Featured <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Product Loop */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-xl">Loading Products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item) => {
              // Gracefully handle alternate image layout namings from the database schema
              const productImg = item.image_url || item.imageUrl;

              return (
                <Link to={`/product/${item.id}`} key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-[420px] transform hover:-translate-y-1 block">
                  <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                      {productImg ? (
                        <img src={productImg.startsWith('http') || productImg.startsWith('/') ? productImg : '/' + productImg} alt={item.name} className="object-contain h-full w-full" />
                      ) : (
                        <span className="text-slate-400 font-medium text-sm">No Image</span>
                      )}
                    </div>
                    <button
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-colors z-20"
                      onClick={(e) => addToWishlist(e, item.id)}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">
                        {item.category?.name || displayTitle}
                      </p>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                      <div className="flex items-center mb-4">
                        <div className="flex text-amber-400 text-sm">
                          {'★'.repeat(Math.round(item.rating || 5))}{'☆'.repeat(5 - Math.round(item.rating || 5))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                      </div>
                      <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95 z-20 relative" onClick={(e) => addToCart(e, item.id)}>
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-bold mb-3 text-slate-800">No products found</h3>
            <p className="text-lg">
              We couldn't find any products mapped under the {displayTitle} category records inside the database.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Category;
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Smartphone, Shirt, Home as HomeIcon, Watch, Book, Dumbbell, LayoutGrid, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { addToCartLogic } from '../services/cartService';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        { name: 'Electronics', path: '/category/electronics' },
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Home & Kitchen', path: '/category/home-kitchen' },
        { name: 'Accessories', path: '/category/accessories' }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('product') // Using user's 'product' table
        .select('*');
      
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronic') || name.includes('phone') || name.includes('tech')) return <Smartphone className="w-8 h-8 text-orange-500" />;
    if (name.includes('fashion') || name.includes('clothes') || name.includes('wear')) return <Shirt className="w-8 h-8 text-orange-500" />;
    if (name.includes('home') || name.includes('kitchen') || name.includes('appliance')) return <HomeIcon className="w-8 h-8 text-orange-500" />;
    if (name.includes('watch') || name.includes('accessor')) return <Watch className="w-8 h-8 text-orange-500" />;
    if (name.includes('book') || name.includes('read')) return <Book className="w-8 h-8 text-orange-500" />;
    if (name.includes('sport') || name.includes('fitness')) return <Dumbbell className="w-8 h-8 text-orange-500" />;
    return <LayoutGrid className="w-8 h-8 text-orange-500" />;
  };

  const addToWishlist = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to add items to your wishlist.");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert([{ user_id: user.id, product_id: productId }]);
        
      if (error) {
        if (error.code === '23505') { // Postgres unique violation
            alert("This item is already in your wishlist!");
        } else {
            console.error("Error adding to wishlist:", error);
            alert("Could not add to wishlist. Error: " + error.message);
        }
      } else {
        alert("Added to wishlist successfully!");
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (err) {
      console.error(err);
      alert("Could not add to wishlist. Error: " + (err.message || "Unknown error"));
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to add items to your cart.");
      return;
    }
    
    try {
      await addToCartLogic(user, productId);
      
      alert("Added to cart successfully!");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      if (err.message === "ADDRESS_REQUIRED") {
        alert("Please save a delivery address before adding products to your cart.");
        window.location.href = '/checkout';
        return;
      }
      console.error("Error adding to cart:", err);
      alert("Could not add to cart. Error: " + (err.message || "Unknown error"));
    }
  };

  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = products.filter(p => {
      if (!p.category) return false;
      return p.category.toLowerCase().includes(category.name.toLowerCase()) || 
             category.name.toLowerCase().includes(p.category.toLowerCase());
    });
    return acc;
  }, {});

  return (
    <>
      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-4 border border-orange-500/30">New Season 2026</span>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Premium Deals<br/>For You!
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                Get up to 50% off on the latest electronics, fashion, and home goods. Upgrade your lifestyle with FlashBasket.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-1 transition-all duration-200 text-lg">
                Start Shopping
              </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-3xl transform rotate-6 shadow-2xl"></div>
                  <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-3 shadow-xl overflow-hidden flex items-center justify-center p-4">
                     <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden">
                         <img src="/Images/logo.png" alt="Hero" className="w-full h-full object-contain" />
                     </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Trending Now Marquee (All Products) */}
      <div className="py-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
                <Link to="/products" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">View All &rarr;</Link>
            </div>
        </div>
        
        {loadingProducts ? (
           <div className="text-center py-20 text-slate-500 font-bold text-xl">Loading Products...</div>
        ) : products.length > 0 ? (
          <div className="relative w-full group py-4">
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex animate-marquee-scroll group-hover:[animation-play-state:paused] w-max">
              {[...products, ...products].map((item, index) => (
                <div key={`trending-${item.id}-${index}`} className="w-72 sm:w-80 flex-shrink-0 mx-4">
                  <Link to={`/product/${item.id}`} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group/card border border-slate-100 flex flex-col h-[420px] transform hover:-translate-y-1 block">
                    <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                       <div className="w-full h-full bg-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover/card:scale-105 overflow-hidden">
                           {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="object-contain h-full w-full" />
                           ) : (
                             <span className="text-slate-400 font-medium text-sm">No Image</span>
                           )}
                       </div>
                       {item.discount && (
                         <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                             -{item.discount}%
                         </div>
                       )}
                       <button 
                         className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-colors z-20"
                         onClick={(e) => addToWishlist(e, item.id)}
                       >
                         <Heart className="w-5 h-5" />
                       </button>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                          <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category || 'General'}</p>
                          <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover/card:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                          <div className="flex items-center mb-4">
                          <div className="flex text-amber-400 text-sm">
                              {'★'.repeat(Math.round(item.rating || 4))}{'☆'.repeat(5 - Math.round(item.rating || 4))}
                          </div>
                          <span className="text-xs text-slate-500 font-medium ml-2">({item.reviews_count || 0} reviews)</span>
                          </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                          {item.original_price && (
                            <span className="text-sm text-slate-400 line-through font-medium">₹{item.original_price}</span>
                          )}
                        </div>
                        <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95 z-20 relative" onClick={(e) => addToCart(e, item.id)}>
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Shop by Category</h2>
        
        {loadingCategories ? (
          <div className="text-center py-10 text-slate-500">Loading Categories...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => {
              const catPath = cat.path || `/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`;
              
              return (
                <Link key={cat.id || index} to={catPath} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden shadow-inner">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(cat.name)
                    )}
                  </div>
                  <span className="font-semibold text-slate-700 text-center group-hover:text-orange-500 transition-colors">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Category-wise Marquees */}
      <div className="py-16 overflow-hidden">
        {loadingProducts ? (
           null // Already loading shown above
        ) : products.length > 0 ? (
          categories.map((category, idx) => {
            const categoryProducts = productsByCategory[category.name] || [];
            
            if (categoryProducts.length === 0) return null;
            
            const catPath = category.path || `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div key={idx} className="mb-16 last:mb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-end mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{category.name}</h2>
                      <Link to={catPath} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">View All {category.name} &rarr;</Link>
                  </div>
                </div>
                
                <div className="relative w-full group py-4">
                  <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="flex animate-marquee-scroll group-hover:[animation-play-state:paused] w-max">
                    {[...categoryProducts, ...categoryProducts].map((item, index) => (
                      <div key={`cat-${category.name}-${item.id}-${index}`} className="w-72 sm:w-80 flex-shrink-0 mx-4">
                        <Link to={`/product/${item.id}`} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group/card border border-slate-100 flex flex-col h-[420px] transform hover:-translate-y-1 block">
                          <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                             <div className="w-full h-full bg-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover/card:scale-105 overflow-hidden">
                                 {item.image_url ? (
                                   <img src={item.image_url} alt={item.name} className="object-contain h-full w-full" />
                                 ) : (
                                   <span className="text-slate-400 font-medium text-sm">No Image</span>
                                 )}
                             </div>
                             {item.discount && (
                               <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                   -{item.discount}%
                               </div>
                             )}
                             <button 
                               className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-colors z-20"
                               onClick={(e) => addToWishlist(e, item.id)}
                             >
                               <Heart className="w-5 h-5" />
                             </button>
                          </div>
                          <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category || 'General'}</p>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover/card:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                                <div className="flex items-center mb-4">
                                <div className="flex text-amber-400 text-sm">
                                    {'★'.repeat(Math.round(item.rating || 4))}{'☆'.repeat(5 - Math.round(item.rating || 4))}
                                </div>
                                <span className="text-xs text-slate-500 font-medium ml-2">({item.reviews_count || 0} reviews)</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                              <div className="flex flex-col">
                                <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                                {item.original_price && (
                                  <span className="text-sm text-slate-400 line-through font-medium">₹{item.original_price}</span>
                                )}
                              </div>
                              <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95 z-20 relative" onClick={(e) => addToCart(e, item.id)}>
                                <ShoppingCart className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-slate-500">No products found in the database yet.</div>
        )}
      </div>
    </>
  );
};

export default Home;

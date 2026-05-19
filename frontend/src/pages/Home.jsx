import React, { useState, useEffect } from 'react';
import { ShoppingCart, Smartphone, Shirt, Home as HomeIcon, Watch, Book, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetching all rows from the 'products' table in Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Electronics', icon: <Smartphone className="w-8 h-8 text-orange-500" />, path: '/category/electronics' },
            { name: 'Fashion', icon: <Shirt className="w-8 h-8 text-orange-500" />, path: '/category/fashion' },
            { name: 'Home & Kitchen', icon: <HomeIcon className="w-8 h-8 text-orange-500" />, path: '/category/home-kitchen' },
            { name: 'Accessories', icon: <Watch className="w-8 h-8 text-orange-500" />, path: '/category/accessories' },
            { name: 'Books', icon: <Book className="w-8 h-8 text-orange-500" />, path: '/category/books' },
            { name: 'Sports', icon: <Dumbbell className="w-8 h-8 text-orange-500" />, path: '/category/sports' },
          ].map((cat) => (
            <Link key={cat.name} to={cat.path} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="font-semibold text-slate-700 text-center group-hover:text-orange-500 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
            <Link to="/products" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">View All &rarr;</Link>
        </div>
        
        {/* Product Grid */}
        {loading ? (
           <div className="text-center py-20 text-slate-500 font-bold text-xl">Loading Products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? products.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 block">
                <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                   <div className="w-full h-full bg-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                       {/* This img tag uses the URL from Supabase! */}
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
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                      <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category || 'General'}</p>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
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
                    <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95" onClick={(e) => { e.preventDefault(); /* Add to cart logic */ }}>
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-10 text-slate-500">No products found in the database yet.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

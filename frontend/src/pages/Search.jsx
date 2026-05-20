import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Search as SearchIcon } from 'lucide-react';
import { supabase } from '../services/supabase';
import { addToCartLogic } from '../services/cartService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchProducts();
  }, [query]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      let queryBuilder = supabase.from('product').select('*');
      
      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }
      
      const { data, error } = await queryBuilder;
        
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
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
        window.showToast?.("Please save a delivery address before adding products to your cart.", "warning");
        window.location.href = '/checkout';
        return;
      }
      console.error("Error adding to cart:", err);
      window.showToast?.("Could not add to cart. Error: " + (err.message || "Unknown error"), "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
        {query ? 'Search Results' : 'All Products'}
      </h1>
      {query ? (
        <p className="text-slate-500 mb-8 font-medium">Showing results for "{query}"</p>
      ) : (
        <p className="text-slate-500 mb-8 font-medium">Browse our full catalog of premium products</p>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold text-xl">Searching...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 block">
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                 <div className="w-full h-full bg-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                     {item.image_url ? (
                       <img src={item.image_url} alt={item.name} className="object-contain h-full w-full" />
                     ) : (
                       <span className="text-slate-400 font-medium text-sm">No Image</span>
                     )}
                 </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category || 'General'}</p>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95" onClick={(e) => addToCart(e, item.id)}>
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
             <SearchIcon className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">We couldn't find any products matching "{query}". Try checking your spelling or using more general terms.</p>
          <Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Search;

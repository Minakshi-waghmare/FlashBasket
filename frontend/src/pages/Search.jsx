import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Search as SearchIcon } from 'lucide-react';

const dummyProducts = [
  { id: 1, name: "Premium Wireless ANC Headphones", price: 1499, category: "Electronics", image: "Image" },
  { id: 2, name: "Smart Fitness Watch", price: 2999, category: "Electronics", image: "Image" },
  { id: 3, name: "Cotton Casual T-Shirt", price: 499, category: "Fashion", image: "Image" },
  { id: 4, name: "Ergonomic Office Chair", price: 5499, category: "Furniture", image: "Image" },
  { id: 5, name: "Bluetooth Speaker Pro", price: 1299, category: "Electronics", image: "Image" }
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const filtered = dummyProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Search Results</h1>
      <p className="text-slate-500 mb-8">Showing results for "{query}"</p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 block">
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                 <div className="w-full h-full bg-slate-200 rounded-xl shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                     <span className="text-slate-400 font-medium">Product Image</span>
                 </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{item.category}</p>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95" onClick={(e) => { e.preventDefault(); }}>
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

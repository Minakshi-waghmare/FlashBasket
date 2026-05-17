import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
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
                     <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50">
                         <span className="text-slate-400 font-medium text-center px-4">Hero Promotional Image</span>
                     </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
            <Link to="/products" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">View All &rarr;</Link>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Link to={`/product/${item}`} key={item} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 block">
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                 <div className="w-full h-full bg-slate-200 rounded-xl shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                     <span className="text-slate-400 font-medium">Product Image</span>
                 </div>
                 <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                     -20%
                 </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">Electronics</p>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">Premium Wireless ANC Headphones Model {item}</h3>
                    <div className="flex items-center mb-4">
                    <div className="flex text-amber-400 text-sm">
                        {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="text-xs text-slate-500 font-medium ml-2">(124 reviews)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">₹1,499</span>
                    <span className="text-sm text-slate-400 line-through font-medium">₹1,999</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95" onClick={(e) => { e.preventDefault(); /* Add to cart logic */ }}>
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

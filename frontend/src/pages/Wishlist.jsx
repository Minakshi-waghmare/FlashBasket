import React from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Wishlist</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-slate-800">5 Items</span>
          <button className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors">Clear Wishlist</button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-slate-400">Image {item}</span>
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">Category</p>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Premium Wireless Headphones</h3>
                <span className="font-bold text-slate-900">₹1,499</span>
              </div>
              
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <button className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </button>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

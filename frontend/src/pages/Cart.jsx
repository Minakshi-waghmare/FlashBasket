import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800">3 Items</span>
              <button className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors">Clear Cart</button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-slate-400">Image {item}</span>
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Premium Wireless Headphones</h3>
                    <p className="text-sm text-slate-500 mb-2">Color: Matte Black</p>
                    <span className="font-bold text-orange-500">₹1,499</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center border-2 border-slate-200 rounded-lg bg-slate-50">
                      <button className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold transition-colors">-</button>
                      <span className="px-3 font-bold text-slate-900">1</span>
                      <button className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold transition-colors">+</button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹4,497</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-orange-500">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-bold text-slate-900">₹180</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">₹4,677</span>
              </div>
            </div>
            
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center text-lg mb-4">
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link to="/" className="w-full block text-center text-slate-500 hover:text-orange-500 font-semibold transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

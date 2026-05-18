import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Mock data for demonstration. In a real app, this comes from backend.
  const [stockQuantity, setStockQuantity] = useState(5); // Change to 0 to see Out of Stock, > 10 for In Stock
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8 bg-slate-50 flex items-center justify-center min-h-[500px]">
            <div className="w-full h-full max-w-md max-h-md bg-slate-200 rounded-2xl shadow-inner flex items-center justify-center">
                <span className="text-slate-400 font-medium text-lg">Product Image {id}</span>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2">Electronics</p>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Premium Wireless ANC Headphones</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-amber-400 text-lg mr-3">
                ★★★★☆
              </div>
              <span className="text-slate-500 font-medium underline cursor-pointer">124 Reviews</span>
            </div>

            <div className="mb-6 flex items-end">
              <span className="text-4xl font-black text-slate-900">₹1,499</span>
              <span className="text-xl text-slate-400 line-through ml-4 mb-1">₹1,999</span>
              <span className="ml-4 mb-2 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Save 25%</span>
            </div>

            {/* Stock Validation UI */}
            <div className="mb-6">
              {stockQuantity === 0 ? (
                <div className="flex items-center text-red-500 bg-red-50 w-fit px-3 py-1.5 rounded-lg border border-red-100">
                  <XCircle className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">Out of Stock</span>
                </div>
              ) : stockQuantity <= 10 ? (
                <div className="flex items-center text-orange-600 bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100 animate-pulse">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">Limited Stock - Only {stockQuantity} left!</span>
                </div>
              ) : (
                <div className="flex items-center text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">In Stock</span>
                </div>
              )}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Experience unparalleled sound quality with our industry-leading active noise cancellation. 
              Designed for comfort and built for durability, these headphones are your perfect companion for travel, work, or relaxation.
            </p>

            <div className="flex items-center space-x-4 mb-10">
              <div className={`flex items-center border-2 rounded-xl bg-slate-50 ${stockQuantity === 0 ? 'border-slate-100 opacity-50' : 'border-slate-200'}`}>
                <button 
                  onClick={handleDecrement}
                  disabled={stockQuantity === 0 || quantity <= 1}
                  className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xl transition-colors disabled:cursor-not-allowed"
                >-</button>
                <span className="px-4 font-bold text-slate-900 text-lg">{stockQuantity === 0 ? 0 : quantity}</span>
                <button 
                  onClick={handleIncrement}
                  disabled={stockQuantity === 0 || quantity >= stockQuantity}
                  className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xl transition-colors disabled:cursor-not-allowed"
                >+</button>
              </div>
              <button 
                disabled={stockQuantity === 0}
                className={`flex-1 font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all flex items-center justify-center text-lg ${
                  stockQuantity === 0 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-500/30 hover:-translate-y-1'
                }`}
              >
                <ShoppingCart className="mr-3 h-6 w-6" /> {stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="p-4 border-2 border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                <div className="flex items-center text-slate-600">
                    <Truck className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center text-slate-600">
                    <RotateCcw className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium">30-Day Returns</span>
                </div>
                <div className="flex items-center text-slate-600">
                    <ShieldCheck className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium">2 Year Warranty</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

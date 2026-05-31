import React, { useEffect } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Order ID</p>
          <p className="font-bold text-slate-900 mb-4">#ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
          
          <p className="text-sm text-slate-500 font-medium mb-1">Estimated Delivery</p>
          <p className="font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" /> By {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
        
        <div className="space-y-3">
          <button className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
            Track Order
          </button>
          <Link to="/" className="w-full block text-slate-600 hover:text-slate-900 font-semibold py-3 transition-colors flex items-center justify-center">
            Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

import React, { useEffect } from 'react';
import { CheckCircle, Package, ArrowRight, CreditCard, Banknote, Printer } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderData = location.state || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const orderId = orderData?.orderId || Math.floor(100000 + Math.random() * 900000);
  const items = orderData?.items || [];
  const paymentMethod = orderData?.paymentMethod || 'Cash on Delivery';
  const total = orderData?.total || 0;

  return (
    <>
      <style>{`
        @media print {
          body {
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            margin: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="print-section max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center animate-in zoom-in duration-500">
          
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Order ID</p>
              <p className="font-bold text-slate-900 mb-4">#ORD-{orderId}</p>
              
              <p className="text-sm text-slate-500 font-medium mb-1">Estimated Delivery</p>
              <p className="font-bold text-slate-900 flex items-center gap-2 mb-4 md:mb-0">
                <Package className="w-4 h-4 text-orange-500" /> By {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Payment Method</p>
              <p className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                {paymentMethod === 'Cash on Delivery' ? (
                  <Banknote className="w-4 h-4 text-emerald-600" />
                ) : (
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                )}
                {paymentMethod}
              </p>
              <p className="text-sm text-slate-500 font-medium mb-1">Total Amount</p>
              <p className="font-bold text-slate-900 text-lg">₹{total.toLocaleString()}</p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mb-8 text-left">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Items Ordered</h3>
              <div className="space-y-4 pr-2">
                {items.map((item, idx) => {
                  const imgUrl = item.imageUrl || item.image_url;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl break-inside-avoid">
                      <div className="w-16 h-16 flex-shrink-0 bg-slate-50 rounded-lg p-1 border border-slate-100 flex items-center justify-center overflow-hidden">
                        {imgUrl ? (
                          <img src={imgUrl.startsWith('http') || imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-slate-400">No Img</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-slate-800 text-sm line-clamp-2">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center no-print mt-8">
            <Link to="/" className="w-full sm:w-auto bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center">
              Continue Shopping
            </Link>
            <button onClick={() => window.print()} className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-bold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;

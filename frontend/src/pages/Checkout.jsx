import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle2, CreditCard, Smartphone, Banknote, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [user, setUser] = useState(null);
  
  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    type: 'Home'
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUserAndAddresses();
  }, []);

  const fetchUserAndAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('address')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        setAddresses(data || []);
        if (data && data.length > 0) {
          setSelectedAddress(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user) {
      setError("Please login to save address.");
      return;
    }
    
    // Basic validation
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
       setError("Please fill all required address fields.");
       return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const payload = {
         user_id: user.id,
         name: newAddress.name,
         phone: newAddress.phone,
         address: `${newAddress.address}, ${newAddress.locality}`,
         city: newAddress.city,
         state: newAddress.state,
         pincode: newAddress.pincode,
         type: newAddress.type
      };
      
      const { data, error } = await supabase
        .from('address')
        .insert([payload])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
         setAddresses([...addresses, data[0]]);
         setSelectedAddress(data[0].id);
         setShowNewAddressForm(false);
         // Reset form
         setNewAddress({
            name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
         });
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Could not save address. " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    if (!selectedAddress) {
      setError('Please select a delivery address.');
      return;
    }
    if (!selectedPayment) {
      setError('Please select a payment method.');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order payload
      const orderPayload = {
        addressId: selectedAddress,
        paymentMethod: selectedPayment,
        items: [
          { productId: 'premium-wireless', quantity: 1, price: 1499 },
          { productId: 'smartphone-case', quantity: 2, price: 499 }
        ],
        totalAmount: 2497
      };

      // Call backend order API (simulated for UI demonstration if backend isn't up)
      // await api.post('/orders', orderPayload);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/order-success');
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Delivery Address Section */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <MapPin className="text-orange-500" /> Delivery Address
            </h2>
            
            <div className="space-y-4">
              {loadingAddresses ? (
                <div className="text-slate-500 py-4 flex items-center"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="text-slate-500 py-4 italic">No addresses saved yet. Please add a new address.</div>
              ) : (
                addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                      selectedAddress === addr.id 
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                        : 'border-slate-100 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-lg">{addr.name}</span>
                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{addr.type || 'Home'}</span>
                      </div>
                      {selectedAddress === addr.id && <CheckCircle2 className="text-orange-500 w-6 h-6 animate-in zoom-in" />}
                    </div>
                    <p className="text-slate-600 text-sm mb-2 leading-relaxed">{addr.address}, {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pincode}</span></p>
                    <p className="text-slate-600 text-sm font-medium">Mobile: <span className="text-slate-800">{addr.phone}</span></p>
                    
                    {selectedAddress === addr.id && (
                      <button className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-md hover:shadow-orange-500/25 transition-all text-sm">
                        Deliver Here
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Address Form */}
            <div className="mt-8">
              {!showNewAddressForm ? (
                <button 
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors py-3"
                >
                  <Plus className="w-5 h-5" /> Add a new address
                </button>
              ) : (
                <div className="mt-2 border border-slate-200 rounded-2xl p-6 md:p-8 bg-slate-50/50 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="font-bold text-slate-800 mb-6 text-lg border-b border-slate-200 pb-3">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" />
                    <input type="text" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} placeholder="Mobile Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" />
                    <input type="text" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} placeholder="Pincode" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" />
                    <input type="text" value={newAddress.locality} onChange={e => setNewAddress({...newAddress, locality: e.target.value})} placeholder="Locality / Town" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" />
                    <textarea value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} placeholder="Address (Area and Street)" rows="3" className="w-full md:col-span-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white resize-none"></textarea>
                    <input type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City / District" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" />
                    <select value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white text-slate-600">
                      <option value="">Select State</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-600 mb-3">Address Type</p>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input type="radio" name="addressType" value="Home" checked={newAddress.type === 'Home'} onChange={e => setNewAddress({...newAddress, type: e.target.value})} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-orange-600 transition-colors">Home</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input type="radio" name="addressType" value="Work" checked={newAddress.type === 'Work'} onChange={e => setNewAddress({...newAddress, type: e.target.value})} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-orange-600 transition-colors">Work</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleSaveAddress}
                      disabled={isProcessing}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all active:scale-95 text-center disabled:opacity-50"
                    >
                      {isProcessing ? 'Saving...' : 'Save & Deliver Here'}
                    </button>
                    <button 
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 font-bold py-3.5 px-6 rounded-xl transition-all text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <CreditCard className="text-orange-500" /> Payment Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* COD */}
              <div 
                onClick={() => setSelectedPayment('cod')}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                  selectedPayment === 'cod' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="relative">
                  <Banknote className={`w-8 h-8 ${selectedPayment === 'cod' ? 'text-orange-500' : 'text-slate-400'}`} />
                  {selectedPayment === 'cod' && (
                    <CheckCircle2 className="absolute -top-2 -right-2 text-orange-500 w-5 h-5 bg-white rounded-full" />
                  )}
                </div>
                <span className={`font-bold ${selectedPayment === 'cod' ? 'text-orange-700' : 'text-slate-700'}`}>Cash on Delivery</span>
              </div>

              {/* UPI */}
              <div 
                onClick={() => setSelectedPayment('upi')}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                  selectedPayment === 'upi' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="relative">
                  <Smartphone className={`w-8 h-8 ${selectedPayment === 'upi' ? 'text-orange-500' : 'text-slate-400'}`} />
                  {selectedPayment === 'upi' && (
                    <CheckCircle2 className="absolute -top-2 -right-2 text-orange-500 w-5 h-5 bg-white rounded-full" />
                  )}
                </div>
                <span className={`font-bold ${selectedPayment === 'upi' ? 'text-orange-700' : 'text-slate-700'}`}>UPI (GPay, PhonePe)</span>
              </div>

              {/* Card / Razorpay placeholder */}
              <div 
                onClick={() => setSelectedPayment('card')}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                  selectedPayment === 'card' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="relative">
                  <CreditCard className={`w-8 h-8 ${selectedPayment === 'card' ? 'text-orange-500' : 'text-slate-400'}`} />
                  {selectedPayment === 'card' && (
                    <CheckCircle2 className="absolute -top-2 -right-2 text-orange-500 w-5 h-5 bg-white rounded-full" />
                  )}
                </div>
                <span className={`font-bold ${selectedPayment === 'card' ? 'text-orange-700' : 'text-slate-700'}`}>Credit / Debit Card</span>
              </div>
            </div>

            {selectedPayment === 'card' && (
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 flex items-center gap-3 animate-in fade-in">
                <CreditCard className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p>You will be securely redirected to <strong>Razorpay</strong> to complete your card payment.</p>
              </div>
            )}
            
            {selectedPayment === 'upi' && (
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 flex items-center gap-3 animate-in fade-in">
                <Smartphone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p>Have your UPI app ready. You will be securely redirected to <strong>Razorpay</strong> to approve the payment.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 border-b border-slate-100 pb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">Img</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Premium Wireless Headphones</h4>
                  <p className="text-xs text-slate-500">Qty: 1</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">₹1,499</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">Img</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Smartphone Case</h4>
                  <p className="text-xs text-slate-500">Qty: 2</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">₹998</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Items Total</span>
                <span className="font-bold text-slate-900">₹2,497</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-500">Free</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Amount Payable</span>
                <span className="text-2xl font-black text-slate-900">₹2,497</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition-all flex items-center justify-center text-lg ${
                isProcessing 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-1'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : (
                selectedPayment === 'cod' ? 'Place Order' : 'Proceed to Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

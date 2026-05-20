import React, { useState, useEffect } from 'react';
import { User, MapPin, LogOut, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
    
    // Fetch addresses
    const { data, error } = await supabase
      .from('address')
      .select('*')
      .eq('user_id', user.id);
      
    if (!error && data) {
      setAddresses(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
       alert("Please fill all required address fields.");
       return;
    }
    
    try {
      setIsProcessing(true);
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
         setShowNewAddressForm(false);
         setNewAddress({
            name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
         });
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Could not save address. " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold text-xl">Loading Profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Hello,</p>
                <p className="font-bold text-slate-900 line-clamp-1">{user?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-500 rounded-xl font-bold cursor-pointer">
                <MapPin className="w-5 h-5" /> Manage Addresses
              </div>
              <div onClick={handleLogout} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold cursor-pointer transition-colors mt-8">
                <LogOut className="w-5 h-5" /> Logout
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="text-orange-500" /> My Addresses
            </h2>
            
            {addresses.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4 font-medium">You don't have any saved addresses.</p>
                <button 
                  onClick={() => setShowNewAddressForm(true)}
                  className="bg-slate-900 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                  Add a New Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border-2 border-slate-100 rounded-xl p-5 hover:border-orange-300 transition-all bg-white relative group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-lg">{addr.name}</span>
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{addr.type || 'Home'}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2 leading-relaxed">{addr.address}, {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pincode}</span></p>
                    <p className="text-slate-600 text-sm font-medium">Mobile: <span className="text-slate-800">{addr.phone}</span></p>
                  </div>
                ))}
              </div>
            )}
            
            {addresses.length > 0 && !showNewAddressForm && (
              <button 
                onClick={() => setShowNewAddressForm(true)}
                className="mt-6 flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors py-3"
              >
                <Plus className="w-5 h-5" /> Add another address
              </button>
            )}

            {/* Form */}
            {showNewAddressForm && (
              <div className="mt-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold text-slate-800 mb-6 text-lg">Add New Address</h3>
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
                    {isProcessing ? 'Saving...' : 'Save Address'}
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
      </div>
    </div>
  );
};

export default Profile;

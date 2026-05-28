import React, { useState, useEffect } from 'react';
import { User, MapPin, LogOut, CheckCircle2, Plus, Loader2, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' or 'settings'

  // Profile / Account settings State
  const [profileName, setProfileName] = useState('');
  const [customAvatar, setCustomAvatar] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

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

  const avatarPresets = [
    { name: 'Rocket Orange', value: 'rocket_orange', class: 'from-orange-400 to-amber-400' },
    { name: 'Emerald Wave', value: 'emerald_wave', class: 'from-emerald-400 to-teal-500' },
    { name: 'Purple Heart', value: 'purple_heart', class: 'from-purple-400 to-indigo-500' },
    { name: 'Rose Petal', value: 'rose_petal', class: 'from-rose-400 to-pink-500' },
    { name: 'Ocean Depth', value: 'ocean_depth', class: 'from-blue-500 to-cyan-400' },
  ];

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      setProfileName(user.user_metadata?.full_name || '');
      setCustomAvatar(user.user_metadata?.custom_avatar || 'rocket_orange');
      
      // Fetch or create public DB user record to get the bigint user_id
      let dbUserId = null;
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();

        if (!dbUser) {
          const { data: newUser } = await supabase
            .from('users')
            .insert([{
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              role: 'customer'
            }])
            .select('id')
            .maybeSingle();
          dbUserId = newUser ? newUser.id : null;
        } else {
          dbUserId = dbUser.id;
        }
      } catch (dbErr) {
        console.error("Error fetching/syncing public DB user:", dbErr);
      }

      // Fetch addresses using the bigint id
      let queryBuilder = supabase.from('address').select('*');
      if (dbUserId) {
        queryBuilder = queryBuilder.eq('user_id', dbUserId);
      } else {
        queryBuilder = queryBuilder.eq('user_id', 0);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error("Error fetching user profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
       window.showToast?.("Please fill all required address fields.", "warning");
       return;
    }
    
    try {
      setIsProcessing(true);

      // Get the bigint user_id
      let dbUserId = null;
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();
        
        if (!dbUser) {
          const { data: newUser } = await supabase
            .from('users')
            .insert([{
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              role: 'customer'
            }])
            .select('id')
            .maybeSingle();
          dbUserId = newUser ? newUser.id : null;
        } else {
          dbUserId = dbUser.id;
        }
      } catch (dbErr) {
        console.error("Error syncing user for address save:", dbErr);
      }

      const payload = {
         user_id: dbUserId || user.id, // Fallback to uuid if dbUser fails
         full_name: newAddress.name,
         phone_number: newAddress.phone,
         street: newAddress.locality ? `${newAddress.address}, ${newAddress.locality}` : newAddress.address,
         city: newAddress.city,
         state: newAddress.state,
         pincode: newAddress.pincode,
         country: 'India'
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
         window.showToast?.("Address saved successfully!", "success");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      window.showToast?.("Could not save address: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    if (!profileName.trim()) {
      setProfileError("Full Name cannot be empty.");
      return;
    }

    setUpdatingProfile(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileName, 
          custom_avatar: customAvatar 
        }
      });
      if (error) throw error;

      setUser(data.user);
      setProfileSuccess("Profile details updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (newPassword.length < 6) {
      setProfileError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileError("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      setProfileSuccess("Password updated successfully!");
    } catch (err) {
      console.error("Error updating password:", err);
      setProfileError(err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarBgClass = (presetValue) => {
    const preset = avatarPresets.find(p => p.value === presetValue);
    return preset ? preset.class : 'from-orange-400 to-amber-400';
  };

  const renderAvatar = (size = 'sidebar') => {
    const isBig = size === 'large';
    const dimensions = isBig ? 'w-24 h-24 text-3xl' : 'w-14 h-14 text-lg';

    if (user?.user_metadata?.avatar_url) {
      return (
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className={`${isBig ? 'w-24 h-24' : 'w-14 h-14'} rounded-full object-cover border-2 border-orange-100 shadow-sm`} 
        />
      );
    }

    const presetClass = getAvatarBgClass(user?.user_metadata?.custom_avatar || customAvatar);
    const initials = getInitials(user?.user_metadata?.full_name || user?.email);

    return (
      <div className={`${dimensions} rounded-full flex items-center justify-center font-black border-2 border-white shadow-md bg-gradient-to-tr text-white ${presetClass}`}>
        {initials}
      </div>
    );
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
              {renderAvatar('sidebar')}
              <div>
                <p className="text-sm text-slate-500 font-medium">Hello,</p>
                <p className="font-extrabold text-slate-900 line-clamp-1">
                  {user?.user_metadata?.full_name || user?.email.split('@')[0]}
                </p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => { setActiveTab('addresses'); setProfileSuccess(null); setProfileError(null); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all text-left ${
                  activeTab === 'addresses' 
                    ? 'bg-orange-50 text-orange-500' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-5 h-5" /> Manage Addresses
              </button>

              <button 
                onClick={() => { setActiveTab('settings'); setProfileSuccess(null); setProfileError(null); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all text-left ${
                  activeTab === 'settings' 
                    ? 'bg-orange-50 text-orange-500' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-5 h-5" /> Account Settings
              </button>

              <div 
                onClick={handleLogout} 
                className="flex items-center gap-3 p-3 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold cursor-pointer transition-colors mt-8"
              >
                <LogOut className="w-5 h-5" /> Logout
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {activeTab === 'addresses' ? (
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
                          <span className="font-bold text-slate-900 text-lg">{addr.full_name || addr.name}</span>
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{addr.type || 'Home'}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-2 leading-relaxed">{addr.street || addr.address}, {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pincode}</span></p>
                      <p className="text-slate-600 text-sm font-medium">Mobile: <span className="text-slate-800">{addr.phone_number || addr.phone}</span></p>
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

              {/* Add Address Form */}
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
          ) : (
            // Account Settings Tab
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <User className="text-orange-500" /> Account Settings
              </h2>

              {profileSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{profileSuccess}</p>
                </div>
              )}

              {profileError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-2 animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{profileError}</p>
                </div>
              )}

              {/* Profile details section */}
              <div className="flex flex-col lg:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                <div className="relative group">
                  {renderAvatar('large')}
                </div>
                <div className="flex-1 w-full">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address (Permanent)</label>
                        <input 
                          type="text" 
                          value={user?.email || ''} 
                          disabled 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)} 
                          placeholder="Your Name" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white" 
                        />
                      </div>
                    </div>

                    {/* Avatar Preset Selectors */}
                    {!user?.user_metadata?.avatar_url && (
                      <div className="mt-4">
                        <p className="text-sm font-bold text-slate-700 mb-2">Choose Avatar Color Theme</p>
                        <div className="flex flex-wrap gap-3">
                          {avatarPresets.map((preset) => (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => setCustomAvatar(preset.value)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                                customAvatar === preset.value
                                  ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${preset.class}`} />
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={updatingProfile}
                        className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                      >
                        {updatingProfile ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                            Saving Details...
                          </>
                        ) : 'Save Details'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Password update section */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <KeyRound className="text-orange-500 w-5 h-5" /> Change Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          placeholder="••••••••" 
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-800" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          placeholder="••••••••" 
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-800" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={updatingPassword}
                      className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                      {updatingPassword ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                          Updating Password...
                        </>
                      ) : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

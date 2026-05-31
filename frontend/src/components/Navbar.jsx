import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Mic, Heart, Headset } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndCounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchCounts(user);
      }
    };

    fetchUserAndCounts();

    const handleWishlistUpdate = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchCounts(user);
      });
    };

    const handleCartUpdate = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchCounts(user);
      });
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        if (session?.access_token) {
          localStorage.setItem('token', session.access_token);
        }
        fetchCounts(currentUser);
      } else {
        localStorage.removeItem('token');
        setWishlistCount(0);
        setCartCount(0);
      }
    });

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      subscription.unsubscribe();
    };
  }, []);

  const fetchCounts = async (authUser) => {
    try {
      if (!authUser) return;

      // Get the bigint user_id
      let dbUserId = null;
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', authUser.email)
          .maybeSingle();
        if (dbUser) dbUserId = dbUser.id;
      } catch (dbErr) {
        console.error("Error fetching dbUser in Navbar:", dbErr);
      }

      // Fetch wishlist using bigint id
      let wishlistQuery = supabase.from('wishlist').select('*', { count: 'exact', head: true });
      if (dbUserId) {
        wishlistQuery = wishlistQuery.eq('user_id', dbUserId);
      } else {
        // Fallback: only query by UUID if we cannot cast it, but if user_id is bigint, we cannot query by uuid string.
        // So we do not query by UUID string if it's bigint, we just use 0 or don't query.
        // Wait, if dbUserId is null, we can skip or use a dummy number to avoid crash.
        // Let's just eq('user_id', 0) since a bigint can be 0 and won't match any user.
        wishlistQuery = wishlistQuery.eq('user_id', 0);
      }
      const { count: wCount } = await wishlistQuery;

      if (wCount !== null) setWishlistCount(wCount);

      // Fetch cart using bigint id
      let cartQuery = supabase.from('carts').select('id');
      if (dbUserId) {
        cartQuery = cartQuery.eq('user_id', dbUserId);
      } else {
        cartQuery = cartQuery.eq('user_id', 0);
      }
      const { data: userCart } = await cartQuery.maybeSingle();

      if (userCart) {
        const { count: cCount } = await supabase
          .from('cart_items')
          .select('*', { count: 'exact', head: true })
          .eq('cart_id', userCart.id);

        if (cCount !== null) setCartCount(cCount);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/Images/logo.png" alt="FlashBasket Logo" className="h-10 mr-3 object-contain" />
              <span className="text-2xl font-black text-orange-500 tracking-tight">Flash<span className="text-slate-900">Basket</span></span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative group flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder={isListening ? "Listening..." : "Search for products, brands and more..."}
                className="w-full bg-slate-100 border-2 border-transparent rounded-lg py-2.5 pl-4 pr-20 focus:border-orange-500 focus:bg-white transition-all outline-none text-slate-800 shadow-inner"
              />
              <button
                onClick={startListening}
                className={`absolute right-12 h-full px-3 transition-colors flex items-center justify-center ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-orange-500'}`}
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                onClick={handleSearch}
                className="absolute right-0 h-full px-4 bg-orange-500 rounded-r-lg text-white hover:bg-orange-600 transition-colors flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/contact" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors group hidden sm:flex">
              <Headset className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">Contact</span>
            </Link>
            <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors group">
              <User className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">{user ? "Profile" : "Login"}</span>
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors relative group">
              {wishlistCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">{wishlistCount}</div>
              )}
              <Heart className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors relative group">
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">{cartCount}</div>
              )}
              <ShoppingCart className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

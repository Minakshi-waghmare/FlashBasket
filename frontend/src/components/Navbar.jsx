import React, { useState } from 'react';
import { ShoppingCart, Search, User, Mic, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

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
            <Link to="/login" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors group">
              <User className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">Profile</span>
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors relative group">
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">5</div>
              <Heart className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-semibold mt-1">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-slate-600 hover:text-orange-500 transition-colors relative group">
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">3</div>
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

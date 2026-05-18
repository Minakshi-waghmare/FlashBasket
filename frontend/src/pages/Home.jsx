import React from 'react';
import { ShoppingCart, Smartphone, Shirt, Home as HomeIcon, Watch, Book, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredProducts = [
  { id: 101, name: "Sony WH-1000XM5 Noise Cancelling", price: "₹29,990", tag: "Hot Deal" },
  { id: 102, name: "Apple Watch Series 9 GPS", price: "₹41,900", tag: "New" },
  { id: 103, name: "Samsung Galaxy S24 Ultra", price: "₹1,29,999", tag: "Best Seller" },
  { id: 104, name: "Nike Air Max 2024 Running", price: "₹12,495", tag: "Trending" },
  { id: 105, name: "MacBook Pro M3 14-inch", price: "₹1,69,900", tag: "Offer" },
  { id: 106, name: "Dyson V15 Detect Vacuum", price: "₹62,900", tag: "Sale" },
  { id: 107, name: "PlayStation 5 Console", price: "₹54,990", tag: "Limited" },
  { id: 108, name: "Canon EOS R5 Mirrorless", price: "₹3,39,995", tag: "Top Rated" }
];

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-4 border border-orange-500/30">New Season 2026</span>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Premium Deals<br/>For You!
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                Get up to 50% off on the latest electronics, fashion, and home goods. Upgrade your lifestyle with FlashBasket.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-1 transition-all duration-200 text-lg">
                Start Shopping
              </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-3xl transform rotate-6 shadow-2xl"></div>
                  <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-3 shadow-xl overflow-hidden flex items-center justify-center p-4">
                     <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50">
                         <span className="text-slate-400 font-medium text-center px-4">Hero Promotional Image</span>
                     </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Electronics', icon: <Smartphone className="w-8 h-8 text-orange-500" />, path: '/category/electronics' },
            { name: 'Fashion', icon: <Shirt className="w-8 h-8 text-orange-500" />, path: '/category/fashion' },
            { name: 'Home & Kitchen', icon: <HomeIcon className="w-8 h-8 text-orange-500" />, path: '/category/home-kitchen' },
            { name: 'Accessories', icon: <Watch className="w-8 h-8 text-orange-500" />, path: '/category/accessories' },
            { name: 'Books', icon: <Book className="w-8 h-8 text-orange-500" />, path: '/category/books' },
            { name: 'Sports', icon: <Dumbbell className="w-8 h-8 text-orange-500" />, path: '/category/sports' },
          ].map((cat) => (
            <Link key={cat.name} to={cat.path} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="font-semibold text-slate-700 text-center group-hover:text-orange-500 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Flash Deals Marquee Section */}
      <div className="py-12 bg-white overflow-hidden border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="text-orange-500 animate-pulse">⚡</span> Flash Deals
          </h2>
          <p className="text-slate-500 mt-2">Grab them before they are gone!</p>
        </div>
        
        <div className="relative flex overflow-x-hidden group">
          {/* We duplicate the array to create a seamless infinite loop */}
          <div className="animate-marquee-scroll flex whitespace-nowrap hover:[animation-play-state:paused] w-max">
            {[...featuredProducts, ...featuredProducts].map((item, index) => (
              <div key={index} className="w-72 mx-4 flex-none">
                <Link to={`/product/${item.id}`} className="block bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 relative group/card hover:-translate-y-1">
                  {item.tag && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm tracking-wide">
                      {item.tag}
                    </span>
                  )}
                  <div className="h-48 bg-slate-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden shadow-inner transition-all duration-300">
                    <span className="text-slate-400 font-medium">Add Image Here</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-1 truncate group-hover/card:text-orange-500 transition-colors">{item.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-black text-slate-900">{item.price}</span>
                      <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors shadow-md active:scale-95">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
            <Link to="/products" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">View All &rarr;</Link>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Link to={`/product/${item}`} key={item} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 block">
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                 <div className="w-full h-full bg-slate-200 rounded-xl shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                     <span className="text-slate-400 font-medium">Product Image</span>
                 </div>
                 <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                     -20%
                 </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">Electronics</p>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">Premium Wireless ANC Headphones Model {item}</h3>
                    <div className="flex items-center mb-4">
                    <div className="flex text-amber-400 text-sm">
                        {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="text-xs text-slate-500 font-medium ml-2">(124 reviews)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">₹1,499</span>
                    <span className="text-sm text-slate-400 line-through font-medium">₹1,999</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-orange-500/25 active:scale-95" onClick={(e) => { e.preventDefault(); /* Add to cart logic */ }}>
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

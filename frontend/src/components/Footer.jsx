import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <span className="text-2xl font-black text-white tracking-tight mb-4 block">Flash<span className="text-orange-500">Basket</span></span>
                <p className="text-sm text-slate-400 leading-relaxed">Your premium destination for the best products at the best prices. Experience shopping like never before.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Home</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Shop</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Customer Service</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Shipping & Returns</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Track Order</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Newsletter</h4>
                <p className="text-sm text-slate-400 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                <div className="flex">
                    <input type="email" placeholder="Your email address" className="bg-slate-800 text-white px-4 py-2 rounded-l-lg outline-none focus:ring-1 focus:ring-orange-500 w-full" />
                    <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg font-bold text-white transition-colors">Go</button>
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; 2026 FlashBasket. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;

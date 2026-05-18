import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-slate-500">Join FlashBasket today!</p>
        </div>
        
        <form>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" placeholder="••••••••" />
            </div>
          </div>
          
          <button type="submit" className="w-full mt-8 bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all">
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
          <a href="#" className="text-xs text-center text-slate-500 uppercase font-bold">or sign up with</a>
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
        </div>
        <div className="mt-6 flex justify-center w-full">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log('Google Sign-Up Success:', credentialResponse);
              // Send credentialResponse.credential to your Spring Boot backend for validation
            }}
            onError={() => {
              console.error('Google Sign-Up Failed');
            }}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signup_with"
          />
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500">Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

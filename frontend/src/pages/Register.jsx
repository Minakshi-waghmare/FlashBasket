import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { supabase } from '../services/supabase';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Store the user's name in Supabase user metadata
          }
        }
      });

      if (signUpError) throw signUpError;

      window.showToast?.('Registration successful! Please login.', 'success');
      navigate('/login');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-slate-500">Join FlashBasket today!</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
          <a href="#" className="text-xs text-center text-slate-500 uppercase font-bold">or sign up with</a>
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
        </div>
        <div className="mt-6 flex justify-center w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
               // Here you would handle Supabase Google OAuth if configured
               console.log('Google Sign-Up Success:', credentialResponse);
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

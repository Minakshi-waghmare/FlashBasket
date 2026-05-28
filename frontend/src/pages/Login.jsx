import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { supabase } from '../services/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Successful login! You can optionally save data.session.access_token to localStorage here,
      // but Supabase handles session storage automatically behind the scenes!
      navigate('/'); // Redirect to home page
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncUserToPublicDb = async (userObj) => {
    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userObj.email)
        .maybeSingle();

      if (!dbUser) {
        await supabase
          .from('users')
          .insert([{
            email: userObj.email,
            name: userObj.user_metadata?.full_name || userObj.email.split('@')[0],
            role: 'customer'
          }]);
      }
    } catch (err) {
      console.error("Error syncing user to public DB:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credentialResponse.credential,
      });

      if (oauthError) throw oauthError;

      if (data && data.user) {
        await syncUserToPublicDb(data.user);
      }

      navigate('/');
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuthRedirect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: redirectError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (redirectError) throw redirectError;
    } catch (err) {
      console.error("Google OAuth Redirect Error:", err);
      setError("Google Redirect failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to your FlashBasket account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="space-y-5">
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
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-orange-500 hover:text-orange-600">Forgot Password?</Link>
              </div>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-slate-500 uppercase font-bold">or sign in with</span>
          <span className="border-b border-slate-200 w-1/5 lg:w-1/4"></span>
        </div>
        <div className="mt-6 flex flex-col gap-4 items-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In failed.')}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signin_with"
          />
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500">Don't have an account? <Link to="/register" className="text-orange-500 font-bold hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Forgot Password?</h1>
          <p className="text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center py-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h2>
            <p className="text-slate-600 mb-6">
              We have sent a password reset link to <strong className="text-slate-800">{email}</strong>. Please check your inbox and spam folder.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="text-orange-500 font-bold hover:underline"
            >
              Didn't receive email? Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-800" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an active session (which is established when redirecting from the reset email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // In many cases, Supabase handles session establishment via hash fragments. 
        // We can listen to auth state changes to detect the session as well.
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            console.log('Recovery session detected');
          }
        });
      }
    };
    checkSession();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Auto logout recovery session so user has to log in with new password
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || 'Could not reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Set New Password</h1>
          <p className="text-slate-500 font-medium">Please enter your new password below.</p>
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
            <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful</h2>
            <p className="text-slate-600 mb-6">
              Your password has been reset successfully. You can now log in using your new password.
            </p>
            <Link 
              to="/login"
              className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all inline-block text-center"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-800" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-slate-800" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Layout = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type = 'success', duration = 3000 } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('show-toast', handleToast);
    
    // Set up global shortcut helper
    window.showToast = (message, type = 'success') => {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type }
      }));
    };

    return () => {
      window.removeEventListener('show-toast', handleToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white border-emerald-100 shadow-emerald-100/50',
          text: 'text-slate-800',
          border: 'border-l-4 border-l-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        };
      case 'error':
        return {
          bg: 'bg-white border-red-100 shadow-red-100/50',
          text: 'text-slate-800',
          border: 'border-l-4 border-l-red-500',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-white border-amber-100 shadow-amber-100/50',
          text: 'text-slate-800',
          border: 'border-l-4 border-l-amber-500',
          icon: <AlertCircle className="w-5 h-5 text-amber-500" />
        };
      default:
        return {
          bg: 'bg-white border-blue-100 shadow-blue-100/50',
          text: 'text-slate-800',
          border: 'border-l-4 border-l-blue-500',
          icon: <Info className="w-5 h-5 text-blue-500" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Toast notifications container */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl ${styles.bg} ${styles.text} ${styles.border} transition-all duration-300 animate-in slide-in-from-right-5 fade-in`}
            >
              <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
              <div className="flex-grow font-semibold text-sm leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;

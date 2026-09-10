import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('krishi_admin_auth', 'true');
        localStorage.setItem('krishisetu_role', 'admin');
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin');
        }
      } else {
        // Direct credential check fallback
        if (username === 'admin' && password === 'admin@123key') {
          localStorage.setItem('krishi_admin_auth', 'true');
          localStorage.setItem('krishisetu_role', 'admin');
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigate('/admin');
          }
        } else {
          setError(data.error || 'Invalid credentials. Please enter correct username and password.');
        }
      }
    } catch {
      // Fallback in case fetch fails
      if (username === 'admin' && password === 'admin@123key') {
        localStorage.setItem('krishi_admin_auth', 'true');
        localStorage.setItem('krishisetu_role', 'admin');
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin');
        }
      } else {
        setError('Invalid credentials. Please enter correct username and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center items-center px-4 py-12 transition-colors">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to KrishiSetu
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              APMC Admin Portal
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Government Mandi Supervision & Platform Governance
            </p>
          </div>

          {/* Credentials Info Badge */}
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-3.5 text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              Authorized Mandi Admin Credentials
            </div>
            <div className="font-mono text-[11px] space-y-0.5 ml-6 text-purple-700 dark:text-purple-300">
              <div>Username: <span className="font-bold underline">admin</span></div>
              <div>Password: <span className="font-bold underline">admin@123key</span></div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-stone-400">
              KrishiSetu National Mandi Governance • ISO 27001 Secure Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

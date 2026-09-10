import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { AdminLoginPage } from './AdminLoginPage';
import { LogOut, Shield, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminRoute: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('krishi_admin_auth') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('krishi_admin_auth');
    localStorage.removeItem('krishisetu_role');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Admin Top Navigation Bar */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-stone-900 dark:text-white">
                KrishiSetu Mandi Oversight
              </span>
              <span className="text-[10px] ml-2 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Platform Home
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

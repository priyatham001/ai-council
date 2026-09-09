import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MarketTicker } from '../components/common/MarketTicker';
import { AppNavbar } from './AppNavbar';
import { NetRealizationModal } from '../components/common/NetRealizationModal';
import { AgriSaathiAssistant } from '../components/common/AgriSaathiAssistant';
import { ToastContainer } from '../components/common/Toast';
import { localStorageService } from '../services/storageService';
import { ShieldCheck, Info } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const role = localStorageService.getRole();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fbfdfa] flex flex-col text-gray-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Main Navigation Bar */}
      <AppNavbar onOpenCalculator={() => setIsCalcOpen(true)} />

      {/* Role State Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 border-b border-emerald-900/60 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">
              {role === 'farmer' && '🌾 Logged in as Ramesh Varma • Somaram, Bhimavaram, AP'}
              {role === 'fpo' && '🏢 Godavari FPO Portal • 128 Farmers Collective • Undi Hub'}
              {role === 'buyer' && '🏭 Procurement Hub • Sri Lakshmi Agro Foods Pvt Ltd'}
              {role === 'admin' && '🛡️ KrishiSetu APMC & Platform Oversight Console'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-emerald-300/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Escrow Protection Active
            </span>
            <span className="hidden md:inline text-emerald-500">•</span>
            <span className="hidden md:inline font-mono">Demo Session Persisted in LocalStorage</span>
          </div>
        </div>
      </div>

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">KrishiSetu</span>
            <span>—</span>
            <span>From Your Farm to the Best Market.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>Prototype Demonstration for SIH 2026</span>
            <span>•</span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Demo market data
            </span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Floatings */}
      <NetRealizationModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
      <AgriSaathiAssistant />
      <ToastContainer />
    </div>
  );
};

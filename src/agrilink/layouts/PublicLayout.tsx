import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { MarketTicker } from '../components/common/MarketTicker';
import { KrishiSetuAI } from '../../components/ai/KrishiSetuAI';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { ToastContainer } from '../components/common/Toast';
import { NetRealizationModal } from '../components/common/NetRealizationModal';
import { ArrowRight, Calculator } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbfdfa] flex flex-col text-gray-900 selection:bg-brand-100 selection:text-brand-900">
      <MarketTicker />

      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <BrandLogo showTagline size="md" />
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-600">
              <Link to="/" className="hover:text-brand-700 transition-colors">Home</Link>
              <Link to="/crop-analysis" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors flex items-center gap-1">
                <span>🌱</span>
                <span>Farm Intelligence</span>
              </Link>
              <Link to="/marketplace" className="text-amber-700 font-bold hover:text-amber-800 transition-colors flex items-center gap-1">
                <span>🚜</span>
                <span>Marketplace</span>
              </Link>
              <Link to="/markets" className="hover:text-brand-700 transition-colors">Market Prices</Link>
              <Link to="/buyers" className="hover:text-brand-700 transition-colors">Verified Buyers</Link>
              <Link to="/how-it-works" className="hover:text-brand-700 transition-colors">How It Works</Link>
              <Link to="/about" className="hover:text-brand-700 transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCalcOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-lg text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
              >
                <Calculator className="w-3.5 h-3.5 text-brand-700" />
                <span>Net Calc</span>
              </button>

              <LanguageSelector variant="light" />

              <Link
                to="/marketplace"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <span>Open Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="text-white font-bold text-base flex items-center gap-2">
                <span className="text-brand-400">KrishiSetu</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                From Your Farm to the Best Market.
                An integrated digital agricultural market-linkage platform engineered for Indian farmers and FPOs.
              </p>
              <span className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2.5 py-1 rounded">
                Smart India Hackathon (SIH) Prototype
              </span>
            </div>

            <div>
              <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider text-[11px]">Key Workflows</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/markets" className="hover:text-white">Mandi Price Explorer</Link></li>
                <li><button onClick={() => setIsCalcOpen(true)} className="hover:text-white text-left">Net Realization Calculator</button></li>
                <li><Link to="/farmer/ai-advisor" className="hover:text-white">AI Sell Advisor</Link></li>
                <li><Link to="/buyers" className="hover:text-white">Verified Institutional Buyers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider text-[11px]">Multi-Role Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/farmer" className="hover:text-white">Farmer Portal (Ramesh Varma)</Link></li>
                <li><Link to="/fpo" className="hover:text-white">FPO Collective (Godavari FPO)</Link></li>
                <li><Link to="/buyer" className="hover:text-white">Corporate Buyer Hub</Link></li>
                <li><Link to="/admin" className="hover:text-white">APMC Admin Console</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider text-[11px]">Trust & Governance</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                All data presented is realistic agricultural demo data modeled on Andhra Pradesh APMC mandis.
              </p>
              <div className="text-gray-400 text-[11px]">
                Demo Version 2.0 • LocalStorage Engine Active
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 KrishiSetu Hackathon Solution Architecture. Built with React, TypeScript, Tailwind CSS.</span>
            <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-300">All rights reserved</span>
          </div>
        </div>
      </footer>

      <NetRealizationModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <KrishiSetuAI />
      <ToastContainer />
    </div>
  );
};

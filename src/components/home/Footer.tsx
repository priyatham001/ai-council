import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowUpRight, Download, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020703] border-t border-emerald-950 text-stone-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-3xl" role="img" aria-label="Sprout">
                🌾
              </span>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  KRISHI<span className="text-emerald-400">SETU</span>
                </h3>
                <p className="text-[11px] font-bold text-amber-300">
                  Farmer Intelligence & Smart Agriculture Platform
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mb-4">
              A comprehensive agricultural intelligence network connecting Indian farmers directly to computerized Agmark quality inspection, fair APMC discovery, and verified direct buyers.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>An Idea Forge Initiative</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Core Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/crop-analysis"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold text-emerald-400"
                >
                  <span>🌱 Farm Intelligence</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-amber-400"
                >
                  <span>🚜 Farmer Marketplace</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  APMC Mandi Explorer
                </Link>
              </li>
              <li>
                <Link to="/buyers" className="hover:text-white transition-colors">
                  Verified Buyer Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Information */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Solution
                </Link>
              </li>
              <li>
                <a
                  href="/KrishiSetu-Final.zip"
                  download="KrishiSetu-Final.zip"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Download Project ZIP</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Helpline */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Kisan Support
            </h4>
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Toll-Free Helpline</span>
              </div>
              <p className="text-sm font-black text-white font-mono">1800-180-1551</p>
              <p className="text-[10px] text-stone-400 mt-1">
                24/7 Farmer Call Center Assistance
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} KrishiSetu. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with dedication for Indian Agriculture</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

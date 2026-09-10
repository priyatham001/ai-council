import React from 'react';
import {
  Sparkles,
  Phone,
  MapPin,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Compass,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface FooterProps {
  onSelectStep?: (step: number) => void;
  onSelectView?: (view: 'landing' | 'workflow') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStep, onSelectView }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center text-xl font-black shadow">
                ⚒️
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  IDEA FORGE
                </span>
                <h3 className="text-xl font-black text-white font-outfit">
                  MahaKrishi AI
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Forging a smarter future for every farmer. AI-powered crop quality intelligence, dynamic location discovery, and smart market connections across India.
            </p>

            <div className="pt-2">
              <a
                href="tel:1234567890"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow transition-transform hover:scale-105"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Support: 1234567890</span>
              </a>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-outfit text-amber-400">
              Platform
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView?.('workflow');
                    onSelectStep?.(1);
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  📍 Smart Location Detection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView?.('workflow');
                    onSelectStep?.(2);
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  🌾 Crop Selection & Weighing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView?.('workflow');
                    onSelectStep?.(2);
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  🤖 AI Quality Vision Chamber
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView?.('workflow');
                    onSelectStep?.(3);
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  🏪 APMC Mandi Discovery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView?.('workflow');
                    onSelectStep?.(4);
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  💰 Verified Dispatch Slip
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Crop Vision */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-outfit text-emerald-400">
              AI Crop Vision
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Luster & Surface Check</li>
              <li>Moisture & Wrinkle Index</li>
              <li>Rot & Fungal Safety Guard</li>
              <li>AGMARK Quality Benchmarking</li>
              <li>Assayer Manual Confirmation</li>
            </ul>
          </div>

          {/* Col 4: Market Intelligence */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-outfit text-sky-400">
              Market Intelligence
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Highway Road Distance</li>
              <li>Truck Freight Calculations</li>
              <li>Net Take-Home Payout</li>
              <li>Direct Google Maps Routing</li>
              <li>MSP Benchmark Floor</li>
            </ul>
          </div>

          {/* Col 5: Location & About */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-outfit text-amber-400">
              About IDEA FORGE
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Built for Bharat</li>
              <li>Zero Middlemen Guesswork</li>
              <li>Multimodal AI Engineering</li>
              <li>Farmer Data Privacy</li>
              <li>Grounded Geographic Data</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} MahaKrishi AI • Crafted by <strong>IDEA FORGE</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Advisory AI Guidelines</span>
            <span>•</span>
            <span>Agmarknet Standards</span>
            <span>•</span>
            <span>24x7 Helpline: 1234567890</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

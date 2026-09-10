import React from 'react';
import { motion } from 'motion/react';
import { Camera, BarChart3, Users, Warehouse, ShieldAlert, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
    title: 'Visual Agmark Assaying',
    description:
      'Snap a photo in the field. Our Gemini-powered model analyzes freshness, size uniformity, foreign matter, and fungal discoloration against codified Agmark specifications.',
    badge: 'Vision AI',
  },
  {
    icon: BarChart3,
    color: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
    title: 'Net Realization Engine',
    description:
      'Compare local mandi modal prices against distant terminal hubs. We automatically subtract realistic freight costs per ton-kilometer to show your true in-pocket profit.',
    badge: 'APMC Markets',
  },
  {
    icon: Warehouse,
    color: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
    title: 'Storage & Degradation Predictor',
    description:
      'Predict how many days your lot will survive under ambient vs. cold storage. Evaluate whether holding produce will earn more than the storage fees.',
    badge: 'Agronomy',
  },
  {
    icon: Users,
    color: 'text-teal-400 bg-teal-950/80 border-teal-500/30',
    title: 'Verified Direct Buyers',
    description:
      'Bypass unnecessary intermediary margins. Connect directly with food processors, exporters, and wholesale buyers with transparent contract offers.',
    badge: 'Marketplace',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#051108] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>INTEGRATED CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Engineered for the Indian Agricultural Ecosystem
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2">
            Every feature addresses the real bottleneck in Indian agricultural supply chains: information asymmetry and quality disputes.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-[#091b10] border border-emerald-900/80 hover:border-emerald-500/40 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-950 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span>Available in workflow</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Real Farm Production Banner */}
        <div className="mt-14 rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-r from-[#06180d] via-[#0b2414] to-[#06180d] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Field Tested & Verified
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Built for real sunlight, real dust, and real mandi trading
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Our models account for smartphone glare, outdoor lighting shifts, and regional variations across Andhra Pradesh, Maharashtra, Karnataka, Punjab, and beyond.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
              <div className="text-2xl font-black text-emerald-400">98.2%</div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Vision Reliability</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-black/40 border border-amber-500/20">
              <div className="text-2xl font-black text-amber-400">₹450+</div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Avg. Quintal Delta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

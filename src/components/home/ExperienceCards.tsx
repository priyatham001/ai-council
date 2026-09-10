import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, ShoppingBag, Microscope } from 'lucide-react';

export const ExperienceCards: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#030c05] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TWO SPECIALIZED PLATFORM EXPERIENCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Choose Your Agricultural Path
          </h2>
          <p className="text-sm sm:text-base text-stone-400 mt-2">
            Whether you want to inspect crop quality or trade with verified buyers, AgriConnect provides dedicated, seamless tools.
          </p>
        </div>

        {/* Two Major Entry Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Farm Intelligence */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-950/60 to-[#06150b] border border-emerald-500/40 shadow-2xl flex flex-col justify-between"
          >
            {/* Top image header with real Indian farmer inspecting produce */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d69102553?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer hands inspecting organic harvest with precision"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150b] via-[#06150b]/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-400/30 text-xs font-bold text-emerald-300">
                  <Microscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Computer Vision & Agronomy</span>
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-label="Sprout">
                    🌱
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    FARM INTELLIGENCE
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mt-2">
                  Analyze your crop using AI, determine quality, receive automatic A/B/C grading, compare markets and discover the best estimated return.
                </p>

                {/* Key Capabilities list */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant camera scan with Government Agmark standards</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Moisture, fungal rot & foreign matter degradation model</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Decision engine: Immediate Mandi vs. Hold & Store vs. Direct Buyer</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-emerald-900/60">
                <Link
                  to="/crop-analysis"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-98"
                >
                  <span>Start Crop Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Farmer Marketplace */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-950/40 via-[#10190f] to-[#06150b] border border-amber-500/40 shadow-2xl flex flex-col justify-between"
          >
            {/* Top image header with real Indian agricultural trade / transport */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer standing with pride near harvest in wheat farm"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150b] via-[#06150b]/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-amber-400/30 text-xs font-bold text-amber-300">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Commerce & Trade</span>
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-label="Tractor">
                    🚜
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    FARMER MARKETPLACE
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mt-2">
                  Explore buyers, lots, offers, logistics, storage and agricultural marketplace opportunities.
                </p>

                {/* Key Capabilities list */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Create certified digital lots with assay certificates</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Connect directly with vetted institutional & FPO buyers</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Integrated freight booking, warehouse storage & escrow payment</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-amber-900/60">
                <Link
                  to="/marketplace"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-400/20 active:scale-98"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

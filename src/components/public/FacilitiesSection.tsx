import React from 'react';
import { motion } from 'motion/react';
import { SCHOOL_FACILITIES } from '../../data/mockData';

export const FacilitiesSection: React.FC = () => {
  return (
    <section id="facilities" className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-orange-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>🛡️</span>
            <span>Child-Safe Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Safe, Hygienic & Inspiring Campus Spaces 🏫
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every square inch of our campus is architected for child ergonomics, round-the-clock safety, and sensory stimulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_FACILITIES.map((facility, idx) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{facility.emoji}</div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${facility.color}`}>
                    Premium Facility
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-800 mb-2">
                  {facility.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {facility.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <span>🛡️ Sanitized Daily & Childproofed</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

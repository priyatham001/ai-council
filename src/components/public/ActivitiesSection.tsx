import React from 'react';
import { motion } from 'motion/react';
import { SCHOOL_ACTIVITIES } from '../../data/mockData';

export const ActivitiesSection: React.FC = () => {
  return (
    <section id="activities" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>🎨</span>
            <span>Joyful Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Hands-on Discovery & Daily Fun Activities 🚀
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every day is a vibrant festival of creativity! From hands-in-the-soil gardening to junior STEM curiosity labs, children learn through experiential delight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_ACTIVITIES.map((act, idx) => (
            <motion.div
              key={act.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 p-3 bg-white w-fit rounded-2xl shadow-xs border border-slate-100">
                  {act.emoji}
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-800 mb-2">
                  {act.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Integrated in Daily Routine</span>
                <span>✨</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

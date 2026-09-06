import React from 'react';
import { motion } from 'motion/react';
import { PARENT_TESTIMONIALS } from '../../data/mockData';
import { Quote, Star, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>💬</span>
            <span>Parent Love & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Hear From Our Preschool Family 💖
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Real feedback from mothers and fathers whose little ones took their first confident steps into the world with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PARENT_TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-amber-300 mb-3 opacity-60" />

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{test.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                <img
                  src={test.avatar}
                  alt={test.parentName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 shadow-xs"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-800">
                    {test.parentName}
                  </h4>
                  <p className="text-[11px] font-semibold text-amber-700">
                    {test.tag}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

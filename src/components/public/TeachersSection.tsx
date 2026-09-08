import React from 'react';
import { motion } from 'motion/react';
import { TEACHER_PROFILES } from '../../data/mockData';
import { Heart, Sparkles, Award } from 'lucide-react';

export const TeachersSection: React.FC = () => {
  return (
    <section id="teachers" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>👩‍🏫</span>
            <span>Passionate Preschool Mentors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Meet the Heart of K for Kidz 💖
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our educators are certified early childhood development specialists who bring boundless warmth, patience, and creative joy to the classroom every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEACHER_PROFILES.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-amber-100">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {teacher.assignedClass}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-800 mb-0.5">
                  {teacher.name}
                </h3>
                <p className="text-xs font-bold text-amber-700 mb-2">
                  {teacher.role}
                </p>

                <p className="text-xs text-slate-500 font-medium mb-3">
                  🎓 {teacher.qualification}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                  {teacher.favoriteQuote}
                </p>
              </div>

              {/* Badges */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-wrap gap-1">
                {teacher.badges.map((badge, i) => (
                  <span key={i} className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

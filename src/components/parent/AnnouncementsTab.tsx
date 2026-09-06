import React from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Bell, Calendar, Tag, AlertCircle, CheckCircle2, FileText, User } from 'lucide-react';

export const AnnouncementsTab: React.FC = () => {
  const { announcements, markAnnouncementAsRead } = useSchoolData();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Official Circulars 📢
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
            School Notices & Circulars
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Stay updated with holiday circulars, PTM schedules, event dress codes, and health advisories.
          </p>
        </div>

        <div className="bg-white/90 text-slate-800 px-4 py-3 rounded-2xl text-center shadow-md">
          <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Notices</span>
          <span className="text-2xl font-black text-slate-900">{announcements.length}</span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann, idx) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-xs space-y-3 ${
              ann.priority === 'Urgent'
                ? 'border-rose-300 bg-rose-50/20'
                : ann.priority === 'High'
                ? 'border-amber-300'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  ann.priority === 'Urgent'
                    ? 'bg-rose-100 text-rose-800'
                    : ann.priority === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {ann.priority} Priority
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Target: <strong className="text-slate-800">{ann.targetClass}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{ann.date}</span>
              </div>
            </div>

            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-800">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {ann.content}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Issued by: <strong className="text-slate-700">{ann.author}</strong>
              </span>

              {!ann.read && (
                <button
                  onClick={() => markAnnouncementAsRead(ann.id)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Mark as Acknowledged ✓
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

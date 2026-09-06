import React from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export const ParentEventsTab: React.FC = () => {
  const { events, toggleEventRsvp } = useSchoolData();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            School Calendar 📅
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
            Upcoming Events & RSVP
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-md">
            Confirm your attendance for upcoming parent-teacher meets, independence celebrations, and eco farm trips.
          </p>
        </div>

        <div className="bg-white/90 text-slate-800 px-4 py-3 rounded-2xl text-center shadow-md">
          <span className="text-[10px] uppercase font-bold text-orange-600 block">Upcoming</span>
          <span className="text-2xl font-black text-slate-900">{events.length} Events</span>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt, idx) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-amber-50">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-md">
                  {evt.category}
                </span>
                {evt.userRsvp && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    RSVP: {evt.userRsvp}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-800">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>

                <div className="space-y-1 pt-1">
                  {evt.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="text-amber-500">✨</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RSVP Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">Are you attending?</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleEventRsvp(evt.id, 'Attending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    evt.userRsvp === 'Attending'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  ✓ Yes
                </button>
                <button
                  onClick={() => toggleEventRsvp(evt.id, 'Not Attending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    evt.userRsvp === 'Not Attending'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  ✕ No
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

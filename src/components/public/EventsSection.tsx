import React from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface EventsSectionProps {
  onOpenAdmissionModal: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onOpenAdmissionModal }) => {
  const { events } = useSchoolData();

  return (
    <section id="events" className="py-16 md:py-24 bg-gradient-to-b from-orange-50/40 via-amber-50/50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>🎪</span>
            <span>School Calendar & Celebrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Upcoming Fun Celebrations & Feasts 🎈
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From patriotic cultural galas to organic farm visits, our school life is packed with exciting experiential celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row"
            >
              {/* Event Image */}
              <div className="md:w-5/12 relative aspect-[4/3] md:aspect-auto">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase">
                  {evt.category}
                </span>
              </div>

              {/* Event Details */}
              <div className="md:w-7/12 p-6 flex flex-col justify-between">
                <div>
                  <div className="space-y-1 text-xs text-slate-500 font-semibold mb-2">
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

                  <h3 className="font-heading font-bold text-lg text-slate-800 mb-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {evt.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {evt.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                        <span className="text-amber-500">✨</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Parents Welcome
                  </span>
                  <button
                    onClick={onOpenAdmissionModal}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
                  >
                    Visitor Pass Info →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

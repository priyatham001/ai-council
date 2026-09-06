import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Smile, 
  Users, 
  Lightbulb, 
  CheckCircle2 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      title: 'Nurturing & Loving Environment',
      desc: 'Warm, compassionate educators who celebrate every little smile, hug away first-day tears, and build self-esteem.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
      border: 'border-rose-200'
    },
    {
      title: 'Play-Based Experiential Learning',
      desc: 'Blending authentic Montessori principles, Reggio Emilia inquiry, and STEM sensory play for holistic development.',
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-700',
      border: 'border-amber-200'
    },
    {
      title: 'Highest Safety & Hygiene Standards',
      desc: '24/7 CCTV surveillance, biometric RFID check-in, sanitization after every activity, and dedicated pediatric care room.',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-700',
      border: 'border-emerald-200'
    },
    {
      title: 'Transparent Parent Partnership',
      desc: 'Live parent portal with daily mood logs, attendance, photos, milestone tracking, and open communication.',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      border: 'border-blue-200'
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] -z-0">
        <span className="font-heading font-black text-8xl md:text-9xl text-amber-900 tracking-wider">
          KAVITHA FOR KIDZ
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-200 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-2xs">
            <span>🌱</span>
            <span>Why Parents Choose K for Kidz • Kavitha for Kidz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            A Happy Second Home for Your Little Explorer 🏡
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The early years from 1.5 to 5.5 are when 90% of brain architecture is formed. At <strong className="text-slate-900 bg-amber-100/70 px-1.5 py-0.5 rounded">K for Kidz (Kavitha for Kidz) Play School</strong>, we weave learning into laughter, songs, crafts, and friendship.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-3xl bg-slate-50/70 border-2 ${pillar.border} transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`w-12 h-12 rounded-2xl ${pillar.color} flex items-center justify-center mb-4 shadow-sm text-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-800 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Two-column highlight showcase */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 rounded-[36px] p-6 sm:p-10 border-2 border-amber-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="bg-white text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                Our Educational Philosophy 📚
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800">
                Learning through Wonder, Touch & Imagination
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than rote memorization, our kids touch real leaves to understand chlorophyll, weigh wooden apples on balance scales to grasp math, and mold clay into story characters to master language.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  'Child-centric curriculum tailored to individual development curves',
                  'Phonics-based reading readiness using Jolly Phonics methodology',
                  'Sensory motor coordination with dedicated obstacle & yoga zones',
                  'Emotional intelligence, mindfulness, and empathy circle time'
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden shadow-md aspect-square border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=80"
                    alt="Nature discovery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md aspect-square border-2 border-white mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500&auto=format&fit=crop&q=80"
                    alt="Clay craft and creative art"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

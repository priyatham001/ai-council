import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AcademicRecord, Student } from '../../types';
import { 
  BookOpen, 
  Binary, 
  Leaf, 
  Palette, 
  MessageCircleHeart, 
  Smile, 
  Activity, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FileText 
} from 'lucide-react';

interface AcademicProgressTabProps {
  child: Student;
  academicRecord?: AcademicRecord;
}

export const AcademicProgressTab: React.FC<AcademicProgressTabProps> = ({
  child,
  academicRecord
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (!academicRecord) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500">
        <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-2" />
        <p className="font-bold text-slate-700">Academic progress evaluation is being prepared.</p>
      </div>
    );
  }

  const subjects = academicRecord.subjects;

  return (
    <div className="space-y-6">
      {/* Top Academic Report Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {academicRecord.term}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              {child.name}’s Learning Journey 🌟
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Holistic preschool development evaluation across language, cognitive numeracy, social bonding, and motor coordination.
            </p>
          </div>

          {/* Overall Grade Badge */}
          <div className="bg-white/95 text-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-xl border-2 border-amber-200 shrink-0 min-w-[170px]">
            <span className="text-[11px] font-extrabold uppercase text-amber-700 block">Overall Mastery</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-600 my-1 font-heading">
              {academicRecord.overallScore}%
            </div>
            <span className="inline-block text-xs font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              {academicRecord.overallGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Cards for Each Domain / Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((sub, idx) => {
          const isSelected = selectedSubject === sub.id;
          const diff = sub.score - sub.previousScore;

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-300 transition-all shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                    {sub.id === 'eng' ? '📚' : sub.id === 'math' ? '🔢' : sub.id === 'evs' ? '🌱' : sub.id === 'art' ? '🎨' : sub.id === 'comm' ? '💬' : sub.id === 'social' ? '🤝' : '🏃'}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-800">
                      {sub.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>Previous: {sub.previousScore}%</span>
                      {diff > 0 && (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> +{diff}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-heading text-slate-800">
                    {sub.score}%
                  </span>
                  <span className="block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    Grade {sub.grade}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                  />
                </div>
              </div>

              {/* Skills checklist tags */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Milestone Competencies:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 border ${
                        skill.status === 'Mastered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {skill.status === 'Mastered' ? '✅' : '🌱'} {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback Note */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 italic">
                <span className="font-bold not-italic text-slate-700">Teacher’s Observation:</span> “{sub.teacherFeedback}”
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-emerald-50/60 rounded-3xl p-6 border-2 border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-lg">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Key Strengths & Flourishing Talents 🌟</span>
          </div>

          <div className="space-y-2.5">
            {academicRecord.strengths.map((str, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-amber-50/60 rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-heading font-bold text-lg">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Opportunities for Growth & Home Practice 🌱</span>
          </div>

          <div className="space-y-2.5">
            {academicRecord.areasForImprovement.map((area, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-700">
                <span className="text-amber-500 text-sm">💡</span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Educator General Term Note */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-base mb-2">
          <FileText className="w-5 h-5 text-amber-500" />
          <span>Class Teacher Overall Term Summary</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
          "{academicRecord.generalRemarks}"
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Signed: <strong className="text-slate-800">{child.teacherName}</strong></span>
          <span>Last Evaluation Date: {academicRecord.updatedAt}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import { MessageSquare, Send, Calendar, Tag, Sparkles, CheckCheck, Smile } from 'lucide-react';

interface TeacherRemarksTabProps {
  child: Student;
}

export const TeacherRemarksTab: React.FC<TeacherRemarksTabProps> = ({ child }) => {
  const { teacherRemarks, addParentReplyToRemark } = useSchoolData();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Filter remarks for this child
  const childRemarks = teacherRemarks.filter(r => r.studentId === child.id);

  const handleSendReply = (remarkId: string) => {
    if (!replyText.trim()) return;
    addParentReplyToRemark(remarkId, replyText);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Daily Teacher Notes 💬
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
            Teacher’s Feedback & Observations
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-md">
            Direct observations from Ms. Priya about {child.name}’s classroom interactions, phonics breakthroughs, and social sharing.
          </p>
        </div>

        <div className="bg-white/90 text-slate-800 px-4 py-3 rounded-2xl text-center shadow-md">
          <span className="text-[10px] uppercase font-bold text-indigo-600 block">Total Notes</span>
          <span className="text-2xl font-black text-slate-900">{childRemarks.length}</span>
        </div>
      </div>

      {/* Feed of Remarks */}
      {childRemarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <p className="text-3xl mb-2">💌</p>
          <h4 className="font-heading font-bold text-slate-700">No notes posted yet today.</h4>
          <p className="text-xs text-slate-400">Class teacher updates daily notes by 2:30 PM.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {childRemarks.map((remark, idx) => (
            <motion.div
              key={remark.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 hover:border-amber-300 shadow-xs space-y-4 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                    👩‍🏫
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-800 text-sm">
                      {remark.teacherName}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {remark.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full">
                    {remark.badge}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {remark.category}
                  </span>
                </div>
              </div>

              {/* Main Remark Message */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “{remark.remark}”
              </div>

              {/* Parent Reply Section */}
              {remark.parentNote ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your Reply (Parent):</span>
                  </div>
                  <p className="pl-5 leading-relaxed">{remark.parentNote}</p>
                </div>
              ) : (
                <div>
                  {activeReplyId === remark.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Write a sweet note back to the teacher..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-400 outline-none resize-none bg-slate-50"
                      ></textarea>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(remark.id)}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(remark.id);
                        setReplyText('');
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer pt-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply to Ms. Priya</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

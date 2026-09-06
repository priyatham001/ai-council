import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AttendanceRecord, Student } from '../../types';
import { useSchoolData } from '../../context/SchoolDataContext';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  FileCheck2, 
  AlertCircle 
} from 'lucide-react';

interface AttendanceTabProps {
  child: Student;
  attendanceRecord?: AttendanceRecord;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  child,
  attendanceRecord
}) => {
  const { submitLeaveRequest, leaveRequests } = useSchoolData();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const total = attendanceRecord?.totalDays || 86;
  const present = attendanceRecord?.presentDays || 81;
  const absent = attendanceRecord?.absentDays || 5;
  const percentage = attendanceRecord?.percentage || 94.2;

  // August 2026 Calendar grid days (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Status mapping for days in August
  const getDayStatus = (dayNum: number) => {
    const dayStr = `2026-08-${String(dayNum).padStart(2, '0')}`;
    const found = attendanceRecord?.history.find(h => h.date === dayStr);
    if (found) return found;

    // Default heuristics for demo
    const dayOfWeek = (new Date(2026, 7, dayNum)).getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek === 0) return { date: dayStr, status: 'holiday', note: 'Sunday' };
    if (dayOfWeek === 6 && dayNum <= 14) return { date: dayStr, status: 'holiday', note: '2nd Saturday' };
    if (dayNum === 15) return { date: dayStr, status: 'holiday', note: 'Independence Day' };
    if (dayNum === 11) return { date: dayStr, status: 'absent', note: 'Sick Leave' };
    if (dayNum <= 20) return { date: dayStr, status: 'present' };
    return { date: dayStr, status: 'upcoming' };
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveData.startDate || !leaveData.reason) return;

    submitLeaveRequest({
      studentId: child.id,
      studentName: child.name,
      parentName: child.parentName,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate || leaveData.startDate,
      reason: leaveData.reason
    });

    setLeaveSubmitted(true);
    setTimeout(() => {
      setLeaveSubmitted(false);
      setShowLeaveModal(false);
      setLeaveData({ startDate: '', endDate: '', reason: '' });
    }, 2000);
  };

  const childLeaves = leaveRequests.filter(l => l.studentId === child.id);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
            📊
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-400">Total School Days</p>
            <p className="text-2xl font-black text-slate-800">{total} Days</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            ✅
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase text-emerald-700">Days Present</p>
            <p className="text-2xl font-black text-emerald-900">{present} Days</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-rose-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
            🏖️
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase text-rose-700">Approved Leaves</p>
            <p className="text-2xl font-black text-rose-900">{absent} Days</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 rounded-3xl text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-amber-100">Attendance Rate</p>
            <p className="text-3xl font-black">{percentage}%</p>
          </div>
          <span className="text-3xl">🌟</span>
        </div>
      </div>

      {/* Monthly Attendance Calendar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-500" />
              <span>Monthly Attendance Record: August 2026</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Updated live from school RFID gate scans</p>
          </div>

          <button
            id="btn-open-leave-modal"
            onClick={() => setShowLeaveModal(true)}
            className="py-2 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>📝 Apply for Leave</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Present in School</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Absent / Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Holiday / Weekend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span>Upcoming</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-extrabold text-slate-400 py-1 uppercase">
              {d}
            </div>
          ))}

          {/* Empty spacer for start day (August 1 2026 is Saturday) */}
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>

          {daysInMonth.map((dayNum) => {
            const dayInfo = getDayStatus(dayNum);
            const status = dayInfo?.status;

            let bgClass = 'bg-slate-50 border-slate-200 text-slate-400';
            if (status === 'present') bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
            if (status === 'absent') bgClass = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
            if (status === 'holiday') bgClass = 'bg-amber-50 border-amber-300 text-amber-800';

            return (
              <div
                key={dayNum}
                className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all text-xs flex flex-col items-center justify-between min-h-[58px] ${bgClass}`}
              >
                <span className="text-sm font-extrabold">{dayNum}</span>
                <span className="text-[10px] truncate max-w-full">
                  {status === 'present' ? '🟢 Present' : status === 'absent' ? '🔴 Absent' : status === 'holiday' ? '🟡 Off' : '⚪'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Application History */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-amber-500" />
          <span>Recent Leave Applications</span>
        </h3>

        {childLeaves.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No leaves submitted this term.</p>
        ) : (
          <div className="space-y-3">
            {childLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      📅 {leave.startDate} {leave.endDate !== leave.startDate ? `to ${leave.endDate}` : ''}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      leave.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leave.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Reason: {leave.reason}</p>
                </div>
                <span className="text-[11px] text-slate-400">Applied: {leave.appliedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-300 shadow-2xl"
          >
            <h3 className="text-xl font-bold font-heading text-slate-800 mb-1">
              Submit Leave Note for {child.name} 📝
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Notifies Class Teacher {child.teacherName} directly.
            </p>

            {leaveSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-center text-sm font-bold">
                ✨ Leave request submitted to school office!
              </div>
            ) : (
              <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={leaveData.startDate}
                      onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={leaveData.endDate}
                      onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Absence *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Mild cold & doctor advised 1 day rest, family function..."
                    value={leaveData.reason}
                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Leave
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

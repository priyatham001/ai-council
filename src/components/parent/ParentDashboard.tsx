import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GalleryPhoto } from '../../types';
import { 
  Home, 
  User, 
  BookOpen, 
  Calendar, 
  Image as ImageIcon, 
  Trophy, 
  Bell, 
  CalendarDays, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';

import { ChildProfileTab } from './ChildProfileTab';
import { AcademicProgressTab } from './AcademicProgressTab';
import { AttendanceTab } from './AttendanceTab';
import { ParentGalleryTab } from './GalleryTab';
import { AchievementsTab } from './AchievementsTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { ParentEventsTab } from './EventsTab';
import { TeacherRemarksTab } from './TeacherRemarksTab';
import { ParentSettingsTab } from './ParentSettingsTab';

interface ParentDashboardProps {
  onSelectGalleryPhoto: (photo: GalleryPhoto) => void;
  onBackToWebsite: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onSelectGalleryPhoto,
  onBackToWebsite
}) => {
  const { user, logout } = useAuth();
  const { 
    students, 
    academicRecords, 
    attendanceRecords, 
    achievementBadges, 
    teacherRemarks, 
    events, 
    announcements 
  } = useSchoolData();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    user?.childId || students[0]?.id || 'std-1'
  );

  // Find the selected child
  const child = students.find(s => s.id === selectedChildId) || students[0];
  const academicRecord = academicRecords.find(r => r.studentId === child?.id);
  const attendanceRecord = attendanceRecords.find(a => a.studentId === child?.id);
  const childBadges = achievementBadges.filter(b => b.studentId === child?.id);
  const childRemarks = teacherRemarks.filter(r => r.studentId === child?.id);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
    { id: 'my-child', label: 'My Child', icon: User, emoji: '👧' },
    { id: 'academic', label: 'Academic Progress', icon: BookOpen, emoji: '📊' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, emoji: '📅' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, emoji: '🖼️' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, emoji: '🏆' },
    { id: 'announcements', label: 'Announcements', icon: Bell, emoji: '📢' },
    { id: 'events', label: 'Events', icon: CalendarDays, emoji: '🎪' },
    { id: 'remarks', label: 'Teacher Remarks', icon: MessageSquare, emoji: '💬' },
    { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-20">
      {/* Top App Header */}
      <header className="bg-white border-b border-amber-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand & Return */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToWebsite}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Return to Public School Website"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Website</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-heading font-black text-xl shadow-md">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-heading font-bold text-sm sm:text-base text-slate-800 leading-tight">
                      K for Kidz
                    </h1>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded-md">
                      Kavitha for Kidz
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-600">
                    Parent Portal 🎒
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Child Selector & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Multiple Children Picker */}
              <div className="flex items-center bg-amber-50 p-1 rounded-2xl border border-amber-200">
                {students.slice(0, 2).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedChildId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      selectedChildId === s.id
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-amber-800'
                    }`}
                  >
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-5 h-5 rounded-full object-cover border border-white"
                    />
                    <span className="hidden md:inline">{s.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Portal Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Welcome Greeting Banner with Soft Pastel Styling */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-100 via-orange-100 to-pink-100 rounded-[32px] p-6 sm:p-8 border-2 border-amber-300 shadow-sm mb-6 relative overflow-hidden"
        >
          <div className="absolute top-2 right-12 text-3xl opacity-20 pointer-events-none animate-float-slow">⭐</div>
          <div className="absolute bottom-2 right-4 text-3xl opacity-20 pointer-events-none animate-float-reverse">🎈</div>
          <div className="absolute top-4 right-44 text-2xl opacity-20 pointer-events-none">🧸</div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="relative">
                <img
                  src={child?.avatar}
                  alt={child?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border border-white">
                  Active
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 text-amber-900 text-[11px] font-extrabold mb-1 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Welcome back, {user?.name || 'Loving Parent'}!</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800">
                  {child?.name}’s Dashboard 🌟
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {child?.class} • Section {child?.section} • Class Teacher: <strong className="text-slate-800">{child?.teacherName}</strong>
                </p>
              </div>
            </div>

            {/* Quick KPI pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Attendance</span>
                <span className="text-base font-black text-amber-900">{child?.attendanceRate}%</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Learning Score</span>
                <span className="text-base font-black text-emerald-800">{child?.overallScore}% ⭐</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Badges</span>
                <span className="text-base font-black text-purple-900">{childBadges.length} 🏆</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs Bar (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mb-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-parent-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                    : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Router */}
        <div>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Daily Care Status Bar */}
              {child?.dailyStatus && (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      <div>
                        <h3 className="font-heading font-bold text-base text-slate-800">
                          Today's Care Routine & Live Mood
                        </h3>
                        <p className="text-[11px] text-slate-400">Logged at {child.dailyStatus.updatedAt} by Teacher Assistant</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      ● Active in Class
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">Morning Mood</span>
                      <span className="text-sm font-extrabold text-slate-800">{child.dailyStatus.mood}</span>
                    </div>
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Nutrition & Snack</span>
                      <span className="text-sm font-extrabold text-slate-800">{child.dailyStatus.snack}</span>
                    </div>
                    <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Nap & Quiet Rest</span>
                      <span className="text-sm font-extrabold text-slate-800">{child.dailyStatus.nap}</span>
                    </div>
                    <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
                      <span className="text-[10px] uppercase font-bold text-rose-700 block">Today's Highlight</span>
                      <span className="text-sm font-extrabold text-slate-800">{child.dailyStatus.activity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2-Column Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Academic Summary & Latest Remarks */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Academic Snapshot Card */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-500" />
                        <h3 className="font-heading font-bold text-base text-slate-800">
                          Learning Highlights ({academicRecord?.term || 'Term 1'})
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('academic')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Full Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {academicRecord?.subjects.slice(0, 4).map((sub) => (
                        <div key={sub.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{sub.subject}</span>
                            <span className="text-amber-800">{sub.score}% (Grade {sub.grade})</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                              style={{ width: `${sub.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Remarks Snapshot */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-heading font-bold text-base text-slate-800">
                          Latest Teacher Note
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('remarks')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>All Notes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {childRemarks.length > 0 ? (
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-900">{childRemarks[0].teacherName}</span>
                          <span className="text-slate-400">{childRemarks[0].date}</span>
                        </div>
                        <p className="text-xs text-slate-700 italic leading-relaxed">
                          “{childRemarks[0].remark}”
                        </p>
                        <span className="inline-block text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                          {childRemarks[0].badge}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes posted today.</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Achievements, Announcements, Quick Actions */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Badges Mini Gallery */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <h3 className="font-heading font-bold text-base text-slate-800">
                          Recent Star Badges
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('achievements')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      {childBadges.slice(0, 3).map((b) => (
                        <div key={b.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                          <div className="text-2xl mb-1">{b.badgeEmoji}</div>
                          <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{b.title}</p>
                          <span className="text-[9px] text-amber-700 font-semibold">{b.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Announcement */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-rose-500" />
                        <h3 className="font-heading font-bold text-base text-slate-800">
                          School Circular
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('announcements')}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {announcements.length > 0 && (
                      <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-900">{announcements[0].title}</span>
                          <span className="text-[10px] text-rose-600 font-bold">{announcements[0].date}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {announcements[0].content}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Event Reminder */}
                  {events.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-6 shadow-md space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                          Next School Celebration 🎪
                        </span>
                        <span className="text-xs font-bold">{events[0].date}</span>
                      </div>
                      <h4 className="font-heading font-bold text-base">{events[0].title}</h4>
                      <p className="text-xs text-amber-100 line-clamp-2">{events[0].description}</p>
                      <button
                        onClick={() => setActiveTab('events')}
                        className="w-full py-2 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-xs hover:bg-amber-50 transition-all cursor-pointer"
                      >
                        View Event & RSVP →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY CHILD PROFILE */}
          {activeTab === 'my-child' && child && (
            <ChildProfileTab child={child} />
          )}

          {/* TAB 3: ACADEMIC PROGRESS */}
          {activeTab === 'academic' && child && (
            <AcademicProgressTab child={child} academicRecord={academicRecord} />
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && child && (
            <AttendanceTab child={child} attendanceRecord={attendanceRecord} />
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === 'gallery' && child && (
            <ParentGalleryTab child={child} onSelectPhoto={onSelectGalleryPhoto} />
          )}

          {/* TAB 6: ACHIEVEMENTS */}
          {activeTab === 'achievements' && child && (
            <AchievementsTab child={child} badges={childBadges} />
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <AnnouncementsTab />
          )}

          {/* TAB 8: EVENTS */}
          {activeTab === 'events' && (
            <ParentEventsTab />
          )}

          {/* TAB 9: REMARKS */}
          {activeTab === 'remarks' && child && (
            <TeacherRemarksTab child={child} />
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <ParentSettingsTab />
          )}
        </div>
      </div>
    </div>
  );
};

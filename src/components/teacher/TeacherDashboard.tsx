import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student, GalleryPhoto } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Award, 
  MessageSquare, 
  Bell, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  BookOpen, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Sparkles, 
  Send, 
  Check, 
  X, 
  Smile, 
  Heart, 
  FileText 
} from 'lucide-react';

interface TeacherDashboardProps {
  onBackToWebsite: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToWebsite }) => {
  const { user, logout } = useAuth();
  const {
    students,
    leaveRequests,
    updateLeaveStatus,
    addTeacherRemark,
    addAnnouncement,
    addGalleryPhoto,
    awardBadgeToStudent,
    updateDailyStatus
  } = useSchoolData();

  const [activeTab, setActiveTab] = useState<'roster' | 'remarks' | 'badges' | 'daily-diary' | 'leaves' | 'announcements' | 'gallery'>('roster');

  // Teacher Remark Form State
  const [selectedStudentForRemark, setSelectedStudentForRemark] = useState<string>(students[0]?.id || '');
  const [remarkText, setRemarkText] = useState('');
  const [remarkBadge, setRemarkBadge] = useState('🌟 Star Learner');
  const [remarkCategory, setRemarkCategory] = useState<'Academic' | 'Behavioral' | 'Creativity' | 'Social' | 'General'>('Academic');
  const [remarkSuccess, setRemarkSuccess] = useState(false);

  // Badge Form State
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<string>(students[0]?.id || '');
  const [badgeTitle, setBadgeTitle] = useState('Kind Heart & Sharing Star');
  const [badgeEmoji, setBadgeEmoji] = useState('💖');
  const [badgeCategory, setBadgeCategory] = useState('Social Emotional');
  const [badgeDesc, setBadgeDesc] = useState('Demonstrated wonderful compassion and helped friends during circle time.');
  const [badgeSuccess, setBadgeSuccess] = useState(false);

  // Daily Diary State
  const [selectedStudentForDiary, setSelectedStudentForDiary] = useState<string>(students[0]?.id || '');
  const [diaryMood, setDiaryMood] = useState('Super Energetic & Joyful ☀️');
  const [diarySnack, setDiarySnack] = useState('Ate fruit bowl & warm milk');
  const [diaryNap, setDiaryNap] = useState('45 min peaceful sleep 💤');
  const [diaryActivity, setDiaryActivity] = useState('Finger painting & building block tower 🏰');
  const [diarySuccess, setDiarySuccess] = useState(false);

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [annTargetClass, setAnnTargetClass] = useState('Nursery - A');
  const [annCategory, setAnnCategory] = useState('Curriculum');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Photo Upload State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800');
  const [photoCategory, setPhotoCategory] = useState('Art & Craft');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoTaggedStudent, setPhotoTaggedStudent] = useState<string>('all');
  const [photoSuccess, setPhotoSuccess] = useState(false);

  // Handlers
  const handlePostRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    addTeacherRemark({
      studentId: selectedStudentForRemark,
      teacherId: user?.id || 'tch-1',
      teacherName: user?.name || 'Ms. Priya Sharma',
      date: 'Today, 2:30 PM',
      remark: remarkText,
      badge: remarkBadge,
      category: remarkCategory
    });

    setRemarkSuccess(true);
    setTimeout(() => {
      setRemarkSuccess(false);
      setRemarkText('');
    }, 2000);
  };

  const handleAwardBadge = (e: React.FormEvent) => {
    e.preventDefault();
    awardBadgeToStudent({
      studentId: selectedStudentForBadge,
      title: badgeTitle,
      badgeEmoji: badgeEmoji,
      description: badgeDesc,
      category: badgeCategory,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      awardedBy: user?.name || 'Ms. Priya Sharma (Class Teacher)'
    });

    setBadgeSuccess(true);
    setTimeout(() => setBadgeSuccess(false), 2000);
  };

  const handlePostDiary = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyStatus(selectedStudentForDiary, {
      mood: diaryMood,
      snack: diarySnack,
      nap: diaryNap,
      activity: diaryActivity,
      updatedAt: 'Just now'
    });

    setDiarySuccess(true);
    setTimeout(() => setDiarySuccess(false), 2000);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle,
      date: 'Aug 16, 2026',
      content: annContent,
      priority: annPriority,
      category: annCategory,
      targetClass: annTargetClass,
      author: user?.name || 'Ms. Priya Sharma (Class Teacher)'
    });

    setAnnSuccess(true);
    setTimeout(() => {
      setAnnSuccess(false);
      setAnnTitle('');
      setAnnContent('');
    }, 2000);
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    addGalleryPhoto({
      title: photoTitle,
      url: photoUrl,
      category: photoCategory,
      date: 'August 16, 2026',
      classTag: 'Nursery - A',
      studentIds: photoTaggedStudent === 'all' ? ['std-1', 'std-2', 'std-3', 'std-4'] : [photoTaggedStudent],
      isPublic: true,
      description: photoDesc || 'Joyful moments captured during today’s session.'
    });

    setPhotoSuccess(true);
    setTimeout(() => {
      setPhotoSuccess(false);
      setPhotoTitle('');
      setPhotoDesc('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 pb-20">
      
      {/* Top Header */}
      <header className="bg-white border-b border-indigo-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToWebsite}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Website</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-heading font-black text-xl shadow-md">
                  👩‍🏫
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-heading font-bold text-sm sm:text-base text-slate-800 leading-tight">
                      K for Kidz
                    </h1>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded-md">
                      Kavitha for Kidz
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-indigo-600">
                    Teacher Console • Nursery Lead 📚
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-full border border-indigo-200">
                👤 {user?.name || 'Ms. Priya Sharma'}
              </span>
              <button
                onClick={logout}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] p-6 sm:p-8 text-white shadow-md mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Class Nursery - Section A (2026-2027) 🎒
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Educator Command Center 🌟
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Track real-time attendance, publish daily care logs, award milestone badges, and broadcast notices to nursery parents.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/95 text-slate-800 p-4 rounded-2xl shadow-xl border-2 border-indigo-200">
            <div className="text-3xl">🧸</div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">Class Strength</span>
              <span className="text-2xl font-black text-slate-900">{students.length} Explorers</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mb-6">
          {[
            { id: 'roster', label: 'Class Roster & Attendance', emoji: '👥' },
            { id: 'daily-diary', label: 'Daily Care Diary', emoji: '📋' },
            { id: 'remarks', label: 'Send Parent Remarks', emoji: '💬' },
            { id: 'badges', label: 'Award Star Badges', emoji: '🏆' },
            { id: 'leaves', label: `Leave Approvals (${leaveRequests.filter(l => l.status === 'pending').length})`, emoji: '🏖️' },
            { id: 'announcements', label: 'Post Announcement', emoji: '📢' },
            { id: 'gallery', label: 'Upload Class Photos', emoji: '📸' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                    : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div>
          {/* TAB: ROSTER */}
          {activeTab === 'roster' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Nursery - Section A Student Roster</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live attendance status and emergency health flags</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span>96% Class Attendance Today ✅</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {students.map((std) => (
                  <div
                    key={std.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-xs"
                        />
                        <div>
                          <h4 className="font-heading font-bold text-sm text-slate-800">{std.name}</h4>
                          <p className="text-[11px] text-slate-500 font-semibold">Roll: #{std.rollNo} • Age: {std.age}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 mb-3">
                        <p><strong>Parent:</strong> {std.parentName}</p>
                        <p><strong>Contact:</strong> {std.parentPhone}</p>
                        {std.allergies && (
                          <span className="inline-block text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                            ⚠️ {std.allergies}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700">Present Today</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DAILY CARE DIARY */}
          {activeTab === 'daily-diary' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Smile className="w-5 h-5 text-amber-500" />
                  <span>Update Child's Daily Care Diary 📋</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly syncs to the child's Parent Portal Dashboard.
                </p>
              </div>

              {diarySuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center font-bold text-sm">
                  ✨ Daily log updated successfully for parent!
                </div>
              ) : (
                <form onSubmit={handlePostDiary} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                    <select
                      value={selectedStudentForDiary}
                      onChange={(e) => setSelectedStudentForDiary(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} (Roll #{s.rollNo})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Morning Mood</label>
                      <input
                        type="text"
                        value={diaryMood}
                        onChange={(e) => setDiaryMood(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Snack & Nutrition</label>
                      <input
                        type="text"
                        value={diarySnack}
                        onChange={(e) => setDiarySnack(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nap / Quiet Rest</label>
                      <input
                        type="text"
                        value={diaryNap}
                        onChange={(e) => setDiaryNap(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Favorite Activity Today</label>
                      <input
                        type="text"
                        value={diaryActivity}
                        onChange={(e) => setDiaryActivity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Daily Status to Parent</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: TEACHER REMARKS */}
          {activeTab === 'remarks' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Send Direct Observation / Note to Parent 💌</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Notify parents of phonics breakthroughs, art talents, or helpful sharing habits.
                </p>
              </div>

              {remarkSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center font-bold text-sm">
                  ✨ Teacher remark delivered to parent!
                </div>
              ) : (
                <form onSubmit={handlePostRemark} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Student *</label>
                    <select
                      value={selectedStudentForRemark}
                      onChange={(e) => setSelectedStudentForRemark(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} (Roll #{s.rollNo})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                      <select
                        value={remarkBadge}
                        onChange={(e) => setRemarkBadge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option>🌟 Star Learner</option>
                        <option>🎨 Creative Genius</option>
                        <option>💖 Kind & Helpful</option>
                        <option>📚 Phonics Master</option>
                        <option>🏃 Active Sunshine</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={remarkCategory}
                        onChange={(e) => setRemarkCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Creativity">Creativity</option>
                        <option value="Social">Social</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teacher's Note / Observation *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your encouraging observation..."
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Note to Parent Portal</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: BADGES */}
          {activeTab === 'badges' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Award Star Badge & Honor 🏆</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Badges will appear in the child's Wall of Fame with celebratory confetti animations!
                </p>
              </div>

              {badgeSuccess ? (
                <div className="p-4 bg-amber-50 text-amber-900 rounded-2xl text-center font-bold text-sm">
                  🎉 Star badge awarded successfully!
                </div>
              ) : (
                <form onSubmit={handleAwardBadge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                    <select
                      value={selectedStudentForBadge}
                      onChange={(e) => setSelectedStudentForBadge(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} (Roll #{s.rollNo})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge Title *</label>
                      <input
                        type="text"
                        required
                        value={badgeTitle}
                        onChange={(e) => setBadgeTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge Icon Emoji</label>
                      <select
                        value={badgeEmoji}
                        onChange={(e) => setBadgeEmoji(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option value="🌟">🌟 Golden Star</option>
                        <option value="💖">💖 Kind Heart</option>
                        <option value="🎨">🎨 Master Artist</option>
                        <option value="📖">📖 Book Worm</option>
                        <option value="🌱">🌱 Green Thumb</option>
                        <option value="🥣">🥣 Clean Plate</option>
                        <option value="🏃">🏃 Little Champion</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Achievement Description</label>
                    <textarea
                      rows={3}
                      value={badgeDesc}
                      onChange={(e) => setBadgeDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Award Badge Now</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: LEAVE APPROVALS */}
          {activeTab === 'leaves' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Review Parent Leave Notes</span>
                </h3>
                <p className="text-xs text-slate-500">Approve or reject absence requests submitted by parents</p>
              </div>

              {leaveRequests.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No leave applications on record.</p>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-800">{leave.studentName}</h4>
                          <span className="text-xs text-slate-500">({leave.parentName})</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            leave.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : leave.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
                        </p>
                        <p className="text-xs text-slate-600 italic">
                          "{leave.reason}"
                        </p>
                      </div>

                      {leave.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'approved')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <span>Publish New Circular / Notice 📢</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Circulars will be visible on all parent dashboards immediately.
                </p>
              </div>

              {annSuccess ? (
                <div className="p-4 bg-indigo-50 text-indigo-900 rounded-2xl text-center font-bold text-sm">
                  ✨ Announcement published to all parents!
                </div>
              ) : (
                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clay Play Workshop this Friday"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                      <select
                        value={annTargetClass}
                        onChange={(e) => setAnnTargetClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option>Nursery - A</option>
                        <option>All Classes</option>
                        <option>Toddler Playgroup</option>
                        <option>LKG - Stars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                      <select
                        value={annPriority}
                        onChange={(e) => setAnnPriority(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={annCategory}
                        onChange={(e) => setAnnCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option>Celebration</option>
                        <option>Curriculum</option>
                        <option>Health & Safety</option>
                        <option>General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Content *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter full notice information..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Broadcast Announcement</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: GALLERY UPLOAD */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span>Upload School & Class Activity Photo 📸</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tag specific children so photos appear in their individual parent feeds.
                </p>
              </div>

              {photoSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-center font-bold text-sm">
                  ✨ Photo added to gallery album!
                </div>
              ) : (
                <form onSubmit={handleUploadPhoto} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Photo Caption / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clay dinosaurs made during craft hour"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Activity Category</label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option>Art & Craft</option>
                        <option>Classroom</option>
                        <option>Activities</option>
                        <option>Sports</option>
                        <option>Celebrations</option>
                        <option>Field Trips</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tag Student</label>
                    <select
                      value={photoTaggedStudent}
                      onChange={(e) => setPhotoTaggedStudent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    >
                      <option value="all">Entire Class (All Nursery Students)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                    <textarea
                      rows={2}
                      value={photoDesc}
                      onChange={(e) => setPhotoDesc(e.target.value)}
                      placeholder="Brief note about the activity..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload & Tag Photo</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

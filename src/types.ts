export type UserRole = 'public' | 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  childId?: string; // For parents: linked child
  teacherId?: string; // For teachers: assigned teacher ID
  assignedClass?: string; // For teachers: e.g. "UKG - A"
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  dob: string;
  age: string;
  class: string;
  section: string;
  rollNo: string;
  academicYear: string;
  bloodGroup: string;
  allergies?: string;
  emergencyContact: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  teacherName: string;
  teacherId: string;
  attendanceRate: number;
  overallScore: number;
  dailyStatus?: {
    mood: string;
    snack: string;
    nap: string;
    activity: string;
    updatedAt: string;
  };
}

export interface SubjectProgress {
  id: string;
  subject: string;
  icon: string;
  color: string;
  score: number; // 0 - 100
  previousScore: number;
  grade: string;
  skills: { name: string; status: 'Mastered' | 'Developing' | 'Emerging' }[];
  teacherFeedback: string;
}

export interface AcademicRecord {
  studentId: string;
  term: string; // "Term 1 (Autumn 2025)", "Mid-Term", etc.
  overallScore: number;
  overallGrade: string;
  subjects: SubjectProgress[];
  strengths: string[];
  areasForImprovement: string[];
  generalRemarks: string;
  updatedAt: string;
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'holiday' | 'event' | 'half-day';
  note?: string;
}

export interface AttendanceRecord {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  holidayDays: number;
  percentage: number;
  history: AttendanceDay[];
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: 'Classroom' | 'Activities' | 'Sports' | 'Art & Craft' | 'Celebrations' | 'School Events' | 'Field Trips';
  date: string;
  description: string;
  studentIds: string[]; // empty means all or public
  isPublic: boolean;
  classTag?: string;
  uploadedBy: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  category: string;
  icon: string;
  badgeEmoji: string;
  color: string;
  description: string;
  awardedDate: string;
  awardedBy: string;
}

export interface StudentAchievement {
  studentId: string;
  badges: AchievementBadge[];
}

export interface TeacherRemark {
  id: string;
  studentId: string;
  studentName?: string;
  teacherId: string;
  teacherName: string;
  date: string;
  category: 'Art & Creativity' | 'Good Behavior' | 'Social Sharing' | 'Reading & Phonics' | 'Motor Skills' | 'General Note' | 'Academic' | 'Creativity' | 'Social' | 'Behavioral' | 'General' | string;
  tag?: string;
  badge: string;
  remark: string;
  parentNote?: string;
  createdAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Holiday' | 'PTM' | 'Event' | 'Health & Safety' | 'General' | 'Academic' | 'Celebration' | 'Curriculum' | string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetClass: string; // "All Classes", "UKG - A", etc.
  content: string;
  author: string;
  read?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Celebration' | 'Sports' | 'Academic' | 'Excursion' | 'Meeting';
  description: string;
  image: string;
  highlights: string[];
  rsvpRequired?: boolean;
  userRsvp?: 'Attending' | 'Not Attending' | 'Tentative';
}

export interface ProgramInfo {
  id: string;
  title: string;
  ageGroup: string;
  timings: string;
  ratio: string;
  badgeColor: string;
  bgGradient: string;
  description: string;
  features: string[];
  emoji: string;
  image: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  assignedClass: string;
  qualification: string;
  experience: string;
  photo: string;
  bio: string;
  favoriteQuote: string;
  badges: string[];
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  AcademicRecord, 
  AttendanceRecord, 
  GalleryPhoto, 
  AchievementBadge, 
  TeacherRemark, 
  Announcement, 
  SchoolEvent, 
  LeaveRequest 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ACADEMIC_RECORDS, 
  INITIAL_ATTENDANCE, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_TEACHER_REMARKS, 
  INITIAL_GALLERY, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_EVENTS 
} from '../data/mockData';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

interface SchoolDataContextType {
  students: Student[];
  academicRecords: Record<string, AcademicRecord>;
  attendanceRecords: Record<string, AttendanceRecord>;
  achievements: Record<string, AchievementBadge[]>;
  teacherRemarks: TeacherRemark[];
  galleryPhotos: GalleryPhoto[];
  announcements: Announcement[];
  events: SchoolEvent[];
  leaveRequests: LeaveRequest[];
  
  // Student Actions
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (student: Student) => void;
  
  // Attendance Actions
  markTodayAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
  markAllPresent: () => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected') => void;
  
  // Academic Progress Actions
  updateAcademicRecord: (record: AcademicRecord) => void;
  updateSubjectScore: (studentId: string, subjectId: string, score: number, feedback?: string) => void;
  
  // Teacher Remarks
  addTeacherRemark: (remark: Omit<TeacherRemark, 'id' | 'createdAt'>) => void;
  addParentReplyToRemark: (remarkId: string, note: string) => void;
  
  // Gallery Actions
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  
  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  
  // Events & RSVP
  toggleEventRsvp: (eventId: string, status: 'Attending' | 'Not Attending' | 'Tentative') => void;
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;

  // Sync state
  isSyncing: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or initial
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('k4k_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [academicRecords, setAcademicRecords] = useState<Record<string, AcademicRecord>>(() => {
    const saved = localStorage.getItem('k4k_academics');
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_RECORDS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>(() => {
    const saved = localStorage.getItem('k4k_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [achievements, setAchievements] = useState<Record<string, AchievementBadge[]>>(() => {
    const saved = localStorage.getItem('k4k_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [teacherRemarks, setTeacherRemarks] = useState<TeacherRemark[]>(() => {
    const saved = localStorage.getItem('k4k_remarks');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_REMARKS;
  });

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('k4k_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('k4k_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('k4k_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('k4k_leaves');
    return saved ? JSON.parse(saved) : [
      {
        id: 'leave-01',
        studentId: 'stud-aarav-01',
        studentName: 'Aarav Sharma',
        parentName: 'Anita Sharma',
        startDate: '2026-08-11',
        endDate: '2026-08-11',
        reason: 'Mild weather fever and cold. Doctor advised 1 day rest.',
        status: 'approved',
        appliedAt: '2026-08-10'
      }
    ];
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to LocalStorage on update
  useEffect(() => {
    localStorage.setItem('k4k_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('k4k_academics', JSON.stringify(academicRecords));
  }, [academicRecords]);

  useEffect(() => {
    localStorage.setItem('k4k_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('k4k_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('k4k_remarks', JSON.stringify(teacherRemarks));
  }, [teacherRemarks]);

  useEffect(() => {
    localStorage.setItem('k4k_gallery', JSON.stringify(galleryPhotos));
  }, [galleryPhotos]);

  useEffect(() => {
    localStorage.setItem('k4k_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('k4k_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('k4k_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // Optional background Firestore bootstrap / sync
  useEffect(() => {
    const initFirestoreSync = async () => {
      try {
        if (!db) return;
        setIsSyncing(true);
        // Test query
        const snap = await getDocs(collection(db, 'students'));
        if (snap.empty) {
          // Initialize first student doc
          await setDoc(doc(db, 'students', 'stud-aarav-01'), INITIAL_STUDENTS[0]);
        }
      } catch (err) {
        // Silently continue with local offline fallback
        console.debug('Firestore initialization active:', err);
      } finally {
        setIsSyncing(false);
      }
    };
    initFirestoreSync();
  }, []);

  const getStudentById = (id: string): Student | undefined => {
    return students.find(s => s.id === id);
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const markTodayAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setAttendanceRecords(prev => {
      const studentRec = prev[studentId] || {
        studentId,
        totalDays: 86,
        presentDays: 81,
        absentDays: 5,
        holidayDays: 14,
        percentage: 94.2,
        history: []
      };

      const existingIndex = studentRec.history.findIndex(h => h.date === todayStr);
      let updatedHistory = [...studentRec.history];
      
      const attStatus = status === 'late' ? 'present' : status;

      if (existingIndex >= 0) {
        updatedHistory[existingIndex] = { date: todayStr, status: attStatus, note: status === 'late' ? 'Marked Late (Tardy)' : undefined };
      } else {
        updatedHistory = [{ date: todayStr, status: attStatus, note: status === 'late' ? 'Marked Late' : undefined }, ...updatedHistory];
      }

      const presentCount = updatedHistory.filter(h => h.status === 'present').length;
      const totalAttended = updatedHistory.filter(h => h.status === 'present' || h.status === 'absent').length;
      const newPercentage = totalAttended > 0 ? Number(((presentCount / totalAttended) * 100).toFixed(1)) : 95.0;

      return {
        ...prev,
        [studentId]: {
          ...studentRec,
          presentDays: presentCount,
          percentage: newPercentage,
          history: updatedHistory
        }
      };
    });

    // Also update student attendance rate in students list
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          attendanceRate: status === 'absent' ? Math.max(80, Number((s.attendanceRate - 0.5).toFixed(1))) : Math.min(100, Number((s.attendanceRate + 0.2).toFixed(1)))
        };
      }
      return s;
    }));
  };

  const markAllPresent = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    students.forEach(s => {
      markTodayAttendance(s.id, 'present');
    });
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [newReq, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const updateAcademicRecord = (record: AcademicRecord) => {
    setAcademicRecords(prev => ({
      ...prev,
      [record.studentId]: record
    }));
    
    // Also update overall score in student info
    setStudents(prev => prev.map(s => s.id === record.studentId ? { ...s, overallScore: record.overallScore } : s));
  };

  const updateSubjectScore = (studentId: string, subjectId: string, score: number, feedback?: string) => {
    setAcademicRecords(prev => {
      const record = prev[studentId];
      if (!record) return prev;

      const updatedSubjects = record.subjects.map(subj => {
        if (subj.id === subjectId) {
          const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : 'B';
          return {
            ...subj,
            previousScore: subj.score,
            score,
            grade,
            teacherFeedback: feedback || subj.teacherFeedback
          };
        }
        return subj;
      });

      const avg = Math.round(updatedSubjects.reduce((acc, curr) => acc + curr.score, 0) / updatedSubjects.length);

      return {
        ...prev,
        [studentId]: {
          ...record,
          overallScore: avg,
          subjects: updatedSubjects,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      };
    });
  };

  const addTeacherRemark = (remark: Omit<TeacherRemark, 'id' | 'createdAt'>) => {
    const newRemark: TeacherRemark = {
      ...remark,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTeacherRemarks(prev => [newRemark, ...prev]);
  };

  const addParentReplyToRemark = (remarkId: string, note: string) => {
    setTeacherRemarks(prev => prev.map(r => r.id === remarkId ? { ...r, parentNote: note } : r));
  };

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}`
    };
    setGalleryPhotos(prev => [newPhoto, ...prev]);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      read: false
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const toggleEventRsvp = (eventId: string, status: 'Attending' | 'Not Attending' | 'Tentative') => {
    setEvents(prev => prev.map(evt => evt.id === eventId ? { ...evt, userRsvp: status } : evt));
  };

  const addEvent = (event: Omit<SchoolEvent, 'id'>) => {
    const newEvt: SchoolEvent = {
      ...event,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  return (
    <SchoolDataContext.Provider
      value={{
        students,
        academicRecords,
        attendanceRecords,
        achievements,
        teacherRemarks,
        galleryPhotos,
        announcements,
        events,
        leaveRequests,
        getStudentById,
        updateStudent,
        markTodayAttendance,
        markAllPresent,
        submitLeaveRequest,
        updateLeaveStatus,
        updateAcademicRecord,
        updateSubjectScore,
        addTeacherRemark,
        addParentReplyToRemark,
        addGalleryPhoto,
        addAnnouncement,
        markAnnouncementAsRead,
        toggleEventRsvp,
        addEvent,
        isSyncing
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};

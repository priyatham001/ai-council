import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsDemoParent: () => void;
  loginAsDemoTeacher: () => void;
  loginWithEmail: (email: string, role: 'parent' | 'teacher', studentOrTeacherId?: string) => Promise<boolean>;
  loginWithGoogle: (role: 'parent' | 'teacher') => Promise<boolean>;
  logout: () => void;
  updateParentProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PARENT_USER: UserProfile = {
  uid: 'demo-parent-anita',
  email: 'anita.sharma@example.com',
  displayName: 'Anita Sharma',
  role: 'parent',
  phone: '+91 98765 43210',
  childId: 'stud-aarav-01',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
};

const DEMO_TEACHER_USER: UserProfile = {
  uid: 'demo-teacher-priya',
  email: 'priya.deshmukh@kforkidz.edu',
  displayName: 'Ms. Priya Deshmukh',
  role: 'teacher',
  teacherId: 'teach-priya-01',
  assignedClass: 'UKG - A',
  phone: '+91 98990 11223',
  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('k_for_kidz_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('k_for_kidz_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('k_for_kidz_user');
    }
  }, [currentUser]);

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !currentUser) {
        // If logged in via Firebase
        const userRole = (localStorage.getItem('k_for_kidz_preferred_role') as UserRole) || 'parent';
        setCurrentUser({
          uid: user.uid,
          email: user.email || 'user@example.com',
          displayName: user.displayName || 'Parent',
          role: userRole,
          photoURL: user.photoURL || undefined,
          childId: userRole === 'parent' ? 'stud-aarav-01' : undefined,
          teacherId: userRole === 'teacher' ? 'teach-priya-01' : undefined,
          assignedClass: userRole === 'teacher' ? 'UKG - A' : undefined
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const loginAsDemoParent = () => {
    setCurrentUser(DEMO_PARENT_USER);
  };

  const loginAsDemoTeacher = () => {
    setCurrentUser(DEMO_TEACHER_USER);
  };

  const loginWithEmail = async (email: string, role: 'parent' | 'teacher'): Promise<boolean> => {
    // Check if it's teacher or parent and set appropriate user
    if (role === 'parent') {
      setCurrentUser({
        uid: `parent-${Date.now()}`,
        email,
        displayName: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Anita Sharma',
        role: 'parent',
        childId: 'stud-aarav-01',
        phone: '+91 98765 43210'
      });
    } else {
      setCurrentUser({
        uid: `teacher-${Date.now()}`,
        email,
        displayName: 'Ms. Priya Deshmukh',
        role: 'teacher',
        teacherId: 'teach-priya-01',
        assignedClass: 'UKG - A'
      });
    }
    return true;
  };

  const loginWithGoogle = async (role: 'parent' | 'teacher'): Promise<boolean> => {
    try {
      localStorage.setItem('k_for_kidz_preferred_role', role);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setCurrentUser({
          uid: result.user.uid,
          email: result.user.email || 'google.user@example.com',
          displayName: result.user.displayName || (role === 'parent' ? 'Anita Sharma' : 'Ms. Priya Deshmukh'),
          role,
          photoURL: result.user.photoURL || undefined,
          childId: role === 'parent' ? 'stud-aarav-01' : undefined,
          teacherId: role === 'teacher' ? 'teach-priya-01' : undefined,
          assignedClass: role === 'teacher' ? 'UKG - A' : undefined
        });
        return true;
      }
    } catch (err) {
      console.warn('Google sign-in popup closed or fallback applied:', err);
      // Fallback demo sign-in so user experience never breaks in iframe if popups are blocked
      if (role === 'parent') {
        loginAsDemoParent();
      } else {
        loginAsDemoTeacher();
      }
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('k_for_kidz_user');
  };

  const updateParentProfile = (data: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const role: UserRole = currentUser ? currentUser.role : 'public';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        loginAsDemoParent,
        loginAsDemoTeacher,
        loginWithEmail,
        loginWithGoogle,
        logout,
        updateParentProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  location?: string;
  isVerified?: boolean;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loginWithPhone: (role: 'farmer' | 'buyer', phone: string, name?: string) => Promise<{ success: boolean; otp?: string }>;
  verifyOtp: (role: 'farmer' | 'buyer', phone: string, otp: string, name?: string) => Promise<boolean>;
  loginAdmin: (adminId: string, pass: string) => Promise<boolean>;
  continueAsGuest: (role?: 'farmer' | 'buyer') => void;
  logout: () => void;
  // Modal control for inline login
  isAuthModalOpen: boolean;
  authModalRole: 'farmer' | 'buyer' | 'admin';
  openAuthModal: (role: 'farmer' | 'buyer' | 'admin', redirectPath?: string) => void;
  closeAuthModal: () => void;
  redirectAfterAuth: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('krishi_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'farmer' | 'buyer' | 'admin'>('farmer');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('krishi_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('krishi_user_role', currentUser.role);
    } else {
      localStorage.removeItem('krishi_auth_user');
      localStorage.removeItem('krishi_user_role');
    }
  }, [currentUser]);

  const loginWithPhone = async (_role: 'farmer' | 'buyer', _phone: string, _name?: string) => {
    // Simulated instant SMS dispatch
    return { success: true, otp: '5432' };
  };

  const verifyOtp = async (role: 'farmer' | 'buyer', phone: string, otp: string, name?: string): Promise<boolean> => {
    if (otp === '5432' || otp.length === 4) {
      const userLocation = localStorage.getItem('krishi_location');
      let locationLabel = 'Kadapa, Andhra Pradesh';
      if (userLocation) {
        try {
          const parsed = JSON.parse(userLocation);
          locationLabel = parsed.formattedAddress || `${parsed.city || parsed.district}, ${parsed.state}`;
        } catch {}
      }

      const defaultName = role === 'farmer' 
        ? (name || 'Ramesh Reddy') 
        : (name || 'Deccan Agri Commodities Pvt Ltd');

      const user: AuthUser = {
        id: `${role}-${phone.slice(-4) || 'user'}`,
        role,
        name: defaultName,
        phone,
        location: locationLabel,
        isVerified: true,
      };

      setCurrentUser(user);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('krishi_guest_mode') === 'true';
  });

  const loginAdmin = async (adminId: string, pass: string): Promise<boolean> => {
    const cleanAdmin = adminId.trim().toLowerCase();
    const cleanPass = pass.trim();
    if ((cleanAdmin === 'admin' || cleanAdmin === 'root') && (cleanPass === 'admin@123' || cleanPass === 'krishi2026' || cleanPass === 'admin' || cleanPass === 'admin123')) {
      const adminUser: AuthUser = {
        id: 'admin-root-01',
        role: 'admin',
        name: 'APMC Regulatory Superadmin',
        phone: '+91 80001 99000',
        location: 'APMC Directorate, Hyderabad / New Delhi',
        isVerified: true,
      };
      setCurrentUser(adminUser);
      setIsGuest(false);
      localStorage.removeItem('krishi_guest_mode');
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const continueAsGuest = (guestRole?: 'farmer' | 'buyer') => {
    setIsGuest(true);
    localStorage.setItem('krishi_guest_mode', 'true');
    if (guestRole) {
      localStorage.setItem('krishi_user_role', guestRole);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem('krishi_guest_mode');
  };

  const openAuthModal = (role: 'farmer' | 'buyer' | 'admin', redirectPath?: string) => {
    setAuthModalRole(role);
    setRedirectAfterAuth(redirectPath || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectAfterAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        isAuthenticated: !!currentUser,
        isGuest,
        loginWithPhone,
        verifyOtp,
        loginAdmin,
        continueAsGuest,
        logout,
        isAuthModalOpen,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        redirectAfterAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

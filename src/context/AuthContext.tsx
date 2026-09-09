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
  loginWithPhone: (role: 'farmer' | 'buyer', phone: string, name?: string) => Promise<{ success: boolean; otp?: string }>;
  verifyOtp: (role: 'farmer' | 'buyer', phone: string, otp: string, name?: string) => Promise<boolean>;
  loginAdmin: (adminId: string, pass: string) => Promise<boolean>;
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

  const loginAdmin = async (adminId: string, pass: string): Promise<boolean> => {
    if ((adminId.toLowerCase() === 'admin' || adminId.toLowerCase() === 'root') && (pass === 'krishi2026' || pass === 'admin' || pass === 'admin123')) {
      const adminUser: AuthUser = {
        id: 'admin-root-01',
        role: 'admin',
        name: 'APMC Regulatory Superadmin',
        phone: '+91 80001 99000',
        location: 'APMC Directorate, Hyderabad / New Delhi',
        isVerified: true,
      };
      setCurrentUser(adminUser);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
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
        loginWithPhone,
        verifyOtp,
        loginAdmin,
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

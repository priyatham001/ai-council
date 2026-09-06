import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Eye, EyeOff, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToParent: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToParent
}) => {
  const { loginWithEmail, loginAsDemoTeacher, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('priya.deshmukh@kforkidz.edu');
  const [password, setPassword] = useState('teacher123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your institutional teacher email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your staff portal password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, 'teacher');
      onClose();
    } catch {
      setErrorMsg('Staff login failed. Please verify credentials or use Quick Demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoTeacher();
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle('teacher');
      onClose();
    } catch {
      setErrorMsg('Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSent(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div
        id="teacher-login-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-indigo-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top decorative accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100 rounded-full opacity-50 pointer-events-none" />

          <button
            id="btn-close-teacher-login"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {showForgotPassword ? (
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">
                Teacher Account Recovery 🔑
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Enter your registered institutional staff email to reset your credentials.
              </p>
              {resetSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold text-center mb-4">
                  ✨ Password reset link sent to your school email!
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Staff School Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya.deshmukh@kforkidz.edu"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Back to Staff Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {/* Header badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/80 px-3 py-1 rounded-full w-fit mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>Educator & Staff Portal</span>
              </div>

              <h2 className="text-2xl font-bold font-heading text-slate-800 mb-1">
                Teacher Classroom Desk 🍎
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Manage your class attendance, student progress marks, gallery uploads, and parent remarks.
              </p>

              {/* Quick Demo Button for Teacher */}
              <div className="mb-5 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Demo Lead Teacher
                  </p>
                  <p className="text-[11px] text-indigo-700">Ms. Priya (UKG - A Class Lead)</p>
                </div>
                <button
                  id="btn-quick-demo-teacher"
                  onClick={handleDemoLogin}
                  className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition-all cursor-pointer hover:scale-105"
                >
                  Instant Login
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teacher School Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-teacher-email"
                      type="email"
                      required
                      placeholder="priya.deshmukh@kforkidz.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Staff Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-teacher-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="checkbox-remember-teacher"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-400 w-4 h-4"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Staff Auth
                  </span>
                </div>

                <button
                  id="btn-submit-teacher-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Enter Teacher Workspace'}</span>
                </button>
              </form>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Or Sign In With
                </span>
              </div>

              <button
                id="btn-google-teacher-login"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Workspace Auth</span>
              </button>

              <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
                Looking for the Parent Portal?{' '}
                <button
                  id="btn-switch-to-parent"
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToParent();
                  }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Parent Login →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

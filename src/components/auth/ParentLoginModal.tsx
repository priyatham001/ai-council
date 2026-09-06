import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Eye, EyeOff, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ParentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToTeacher: () => void;
}

export const ParentLoginModal: React.FC<ParentLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToTeacher
}) => {
  const { loginWithEmail, loginAsDemoParent, loginWithGoogle } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('anita.sharma@example.com');
  const [password, setPassword] = useState('parent123');
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

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(emailOrPhone, 'parent');
      onClose();
    } catch {
      setErrorMsg('Login failed. Please verify credentials or use Quick Demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoParent();
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle('parent');
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
        id="parent-login-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header decorative tag */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100 rounded-full opacity-50 pointer-events-none" />

          <button
            id="btn-close-parent-login"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {showForgotPassword ? (
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">
                Reset Parent Password 🔑
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Enter your registered mobile or email to receive a password recovery link.
              </p>
              {resetSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold text-center mb-4">
                  ✨ Reset instructions sent to your registered email!
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email or Mobile Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. anita.sharma@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
                  >
                    Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {/* Top pill */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full w-fit mb-3">
                <span>👨‍👩‍👦</span>
                <span>Parent Portal Access</span>
              </div>

              <h2 className="text-2xl font-bold font-heading text-slate-800 mb-1">
                Welcome Back, Parent! 🌈
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Log in to check your child's daily mood, attendance, progress, and memories.
              </p>

              {/* Quick Demo Button */}
              <div className="mb-5 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Demo Parent Account
                  </p>
                  <p className="text-[11px] text-amber-700">Anita Sharma (Aarav's Mother)</p>
                </div>
                <button
                  id="btn-quick-demo-parent"
                  onClick={handleDemoLogin}
                  className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition-all cursor-pointer hover:scale-105"
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
                    Email / Registered Mobile
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-parent-email"
                      type="text"
                      required
                      placeholder="anita.sharma@example.com"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-semibold text-amber-600 hover:text-amber-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-parent-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
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
                      id="checkbox-remember-parent"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-500" /> 256-bit Safe
                  </span>
                </div>

                <button
                  id="btn-submit-parent-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Log In to Parent Portal'}</span>
                </button>
              </form>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Or Connect With
                </span>
              </div>

              <button
                id="btn-google-parent-login"
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
                <span>Continue with Google Sign-In</span>
              </button>

              <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
                Are you a teacher or staff member?{' '}
                <button
                  id="btn-switch-to-teacher"
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToTeacher();
                  }}
                  className="text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  Teacher Portal Login →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

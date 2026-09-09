import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  User,
  Building2,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const PhoneLoginModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalRole,
    closeAuthModal,
    verifyOtp,
    loginAdmin,
    continueAsGuest,
    redirectAfterAuth,
  } = useAuth();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  // Step 1: Phone / Credentials input, Step 2: OTP input
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState<string>('9848012345');
  const [name, setName] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Admin credentials
  const [adminId, setAdminId] = useState<string>('admin');
  const [password, setPassword] = useState<string>('krishi2026');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMessage(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number.'));
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setOtp('5432'); // Pre-fill demo code for seamless SIH hackathon evaluation
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    const success = await verifyOtp(
      authModalRole === 'admin' ? 'farmer' : authModalRole,
      phone,
      otp,
      name
    );
    setIsLoading(false);
    if (!success) {
      setErrorMessage(t('auth.invalidOtp', 'Invalid code. Please enter 5432 for demo access.'));
    } else {
      if (redirectAfterAuth) {
        window.location.href = redirectAfterAuth;
      }
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    const success = await loginAdmin(adminId, password);
    setIsLoading(false);
    if (!success) {
      setErrorMessage('Invalid Admin ID or Password. Try: admin / krishi2026');
    } else {
      if (redirectAfterAuth) {
        window.location.href = redirectAfterAuth;
      }
    }
  };

  const roleTitle =
    authModalRole === 'farmer'
      ? t('auth.farmerLogin', 'Farmer Secure Login')
      : authModalRole === 'buyer'
      ? t('auth.buyerLogin', 'Buyer Procurement Login')
      : t('auth.adminLogin', 'Admin Governance Login');

  const roleDesc =
    authModalRole === 'farmer'
      ? t('auth.farmerLoginDesc', 'Enter your mobile number to receive a one-time verification code.')
      : authModalRole === 'buyer'
      ? t('auth.buyerLoginDesc', 'Access commercial crop procurement and place direct bids.')
      : t('auth.adminLoginDesc', 'Platform oversight, dispute resolution, and KYC management.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
              authModalRole === 'farmer'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : authModalRole === 'buyer'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {authModalRole === 'farmer' ? (
              <User className="w-6 h-6" />
            ) : authModalRole === 'buyer' ? (
              <Building2 className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                authModalRole === 'farmer'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : authModalRole === 'buyer'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {authModalRole.toUpperCase()} PORTAL
            </span>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">{roleTitle}</h2>
          </div>
        </div>

        <p className="text-xs text-stone-700 dark:text-stone-300 mb-6 leading-relaxed">
          {roleDesc}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {authModalRole === 'admin' ? (
          /* Admin ID + Password Form */
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                {t('auth.adminId', 'Admin ID')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
              💡 {t('auth.adminDemoHint', 'Demo: admin / admin@123')}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{t('auth.signIn', 'Sign In to Admin Console')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : step === 1 ? (
          /* Phone Input Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                {authModalRole === 'farmer' ? 'Farmer Name (Optional)' : 'Company / Business Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={authModalRole === 'farmer' ? 'e.g. Ramesh Reddy' : 'e.g. Deccan Foods Pvt Ltd'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                {t('auth.mobileNumber', 'Mobile Number')}
              </label>
              <div className="flex rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 focus-within:ring-2 focus-within:ring-emerald-500">
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-3.5 py-2.5 text-sm font-bold flex items-center border-r border-stone-200 dark:border-stone-700">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="98480 12345"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Instant mobile authentication with direct buyer/farmer role separation.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                authModalRole === 'farmer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span>{t('auth.sending', 'Sending...')}</span>
              ) : (
                <>
                  <span>{t('auth.sendOtp', 'Send OTP')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-center space-y-1">
              <button
                type="button"
                onClick={() => {
                  const roleForGuest = authModalRole === 'buyer' ? 'buyer' : 'farmer';
                  continueAsGuest(roleForGuest);
                  if (redirectAfterAuth) {
                    window.location.href = redirectAfterAuth;
                  }
                }}
                className="text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold py-1.5 transition-colors cursor-pointer"
              >
                👀 {t('auth.continueAsGuest', 'Continue as Guest (Explore UI & Markets)')}
              </button>
              <p className="text-[10px] text-stone-400 leading-tight">
                {t('auth.guestNotice', 'Explore UI and sample listings. OTP required to post crops or place bids.')}
              </p>
            </div>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('auth.enterOtp', 'Enter 4-Digit OTP')}
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Change number
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mb-2">
                {t('auth.otpSentTo', 'Verification code sent to +91')} {phone}
              </p>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="5432"
                className="w-full tracking-widest text-center text-2xl font-mono py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
              <span className="text-stone-600 dark:text-stone-400">
                {t('auth.demoOtpHint', 'Demo OTP: 5432')}
              </span>
              <button
                type="button"
                onClick={() => setOtp('5432')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('auth.quickFill', 'Auto-fill 5432')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 4}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                authModalRole === 'farmer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span>{t('auth.verifying', 'Verifying...')}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('auth.verifyOtp', 'Verify & Enter')}</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={() => {
                  const roleForGuest = authModalRole === 'buyer' ? 'buyer' : 'farmer';
                  continueAsGuest(roleForGuest);
                  if (redirectAfterAuth) {
                    window.location.href = redirectAfterAuth;
                  }
                }}
                className="text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold py-1 transition-colors cursor-pointer"
              >
                👀 {t('auth.continueAsGuest', 'Continue as Guest')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

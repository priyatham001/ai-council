import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Calculator,
  MapPin
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import { localStorageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { UserRole, NotificationItem, FarmerPersona } from '../types';
import { t } from '../lib/i18n';
import { DEMO_FARMER_PERSONAS } from '../data/panIndiaData';

interface AppNavbarProps {
  onOpenCalculator?: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ onOpenCalculator }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [role, setRole] = useState<UserRole>(localStorageService.getRole());
  const [persona, setPersona] = useState<FarmerPersona>(localStorageService.getPersona());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setRole(localStorageService.getRole());
      setPersona(localStorageService.getPersona());
      setNotifications(notificationService.getAll());
    };
    update();

    window.addEventListener('smartagrilink_role_changed', update);
    window.addEventListener('smartagrilink_persona_changed', update);
    window.addEventListener('smartagrilink_location_changed', update);
    window.addEventListener('smartagrilink_data_changed', update);

    return () => {
      window.removeEventListener('smartagrilink_role_changed', update);
      window.removeEventListener('smartagrilink_persona_changed', update);
      window.removeEventListener('smartagrilink_location_changed', update);
      window.removeEventListener('smartagrilink_data_changed', update);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handlePersonaSwitch = (newPersonaId: string) => {
    const updated = localStorageService.setPersona(newPersonaId);
    setPersona(updated);
  };


  const handleRoleSwitch = (newRole: UserRole) => {
    localStorageService.setRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'farmer') navigate('/farmer');
    else if (newRole === 'fpo') navigate('/fpo');
    else if (newRole === 'buyer') navigate('/buyer');
    else if (newRole === 'admin') navigate('/admin');
  };

  const farmerLinks = [
    { label: '📊 Dashboard', path: '/marketplace' },
    { label: t('lots', language), path: '/marketplace/lots' },
    { label: t('buyers', language), path: '/marketplace/buyers' },
    { label: t('offers', language), path: '/marketplace/offers' },
    { label: t('logistics', language), path: '/marketplace/logistics' },
    { label: t('storage', language), path: '/marketplace/storage' },
    { label: t('transactions', language), path: '/marketplace/transactions' },
    { label: t('grievances', language), path: '/marketplace/grievances' },
    { label: t('markets', language), path: '/marketplace/markets' },
    { label: t('aiAdvisor', language), path: '/marketplace/advisor' }
  ];

  const fpoLinks = [
    { label: 'Overview', path: '/fpo' },
    { label: 'Members (128)', path: '/fpo/members' },
    { label: 'Consolidated Lots', path: '/fpo/lots' },
    { label: 'Buyer Demands', path: '/fpo/demand' },
    { label: 'Bulk Offers', path: '/fpo/offers' },
    { label: 'Logistics', path: '/fpo/logistics' },
    { label: 'FPO Analytics', path: '/fpo/analytics' }
  ];

  const buyerLinks = [
    { label: 'Procurement Board', path: '/buyer' },
    { label: 'Post Demand', path: '/buyer/requirements' },
    { label: 'Farmer Lots', path: '/buyer/lots' },
    { label: 'Submitted Offers', path: '/buyer/offers' },
    { label: 'Orders In Transit', path: '/buyer/orders' },
    { label: 'Escrow Payments', path: '/buyer/payments' }
  ];

  const adminLinks = [
    { label: 'System Overview', path: '/admin' },
    { label: 'Farmers Directory', path: '/admin/farmers' },
    { label: 'Buyer KYC Verification', path: '/admin/buyers' },
    { label: 'Mandi Management', path: '/admin/markets' },
    { label: 'Transactions', path: '/admin/transactions' },
    { label: 'Grievances Cell', path: '/admin/grievances' },
    { label: 'Platform Analytics', path: '/admin/analytics' }
  ];

  const currentNavLinks =
    role === 'farmer' ? farmerLinks : role === 'fpo' ? fpoLinks : role === 'buyer' ? buyerLinks : adminLinks;

  const roleColors = {
    farmer: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    fpo: 'bg-blue-50 text-blue-800 border-blue-300',
    buyer: 'bg-amber-50 text-amber-800 border-amber-300',
    admin: 'bg-purple-50 text-purple-800 border-purple-300'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="shrink-0" title="Go to KrishiSetu Homepage">
              <BrandLogo showTagline size="md" />
            </Link>

            {/* Quick cross-experience navigation */}
            <div className="hidden md:flex items-center gap-1.5 ml-1">
              <Link
                to="/"
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/crop-analysis"
                className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>🌱</span>
                <span>Farm Intelligence</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto px-2">
            {currentNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-800 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Demo Location Switcher (Section 25 Requirement) */}
            {role === 'farmer' && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-xl shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 animate-pulse" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider hidden sm:block">Demo Location:</span>
                  <select
                    value={persona.id}
                    onChange={(e) => handlePersonaSwitch(e.target.value)}
                    className="bg-transparent text-emerald-950 text-xs font-black focus:outline-none cursor-pointer pr-1"
                    title="Switch Demo Farmer State & Persona"
                  >
                    {DEMO_FARMER_PERSONAS.map(p => (
                      <option key={p.id} value={p.id}>
                        📍 {p.district}, {p.state} ({p.primaryCrop})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Quick Net Calculator Trigger */}
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-lg text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
                title="Open Net Realization Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-brand-700" />
                <span>Net Calc</span>
              </button>
            )}

            {/* Language Selector — exactly the 7 supported languages, driven by
                the central LanguageContext (single source of truth). */}
            <LanguageSelector variant="light" />

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs) notificationService.markAllAsRead();
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Notifications</span>
                    <span className="text-[10px] text-gray-500">Live feed</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setShowNotifs(false);
                            if (n.link) navigate(n.link);
                          }}
                          className={`p-3 text-xs hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-brand-50/40' : ''}`}
                        >
                          <div className="font-bold text-gray-900">{n.title}</div>
                          <p className="text-gray-600 mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs ${roleColors[role]}`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="capitalize">{t(`role${role.charAt(0).toUpperCase() + role.slice(1)}`, language)}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Switch Active Demo Role
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('farmer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between text-emerald-950 font-semibold"
                  >
                    <span>🌾 Farmer (Ramesh Varma)</span>
                    {role === 'farmer' && <span className="text-emerald-600 text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('fpo')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between text-blue-950 font-semibold"
                  >
                    <span>🏢 FPO Lead (Godavari FPO)</span>
                    {role === 'fpo' && <span className="text-blue-600 text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('buyer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between text-amber-950 font-semibold"
                  >
                    <span>🏭 Institutional Buyer</span>
                    {role === 'buyer' && <span className="text-amber-600 text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between text-purple-950 font-semibold"
                  >
                    <span>🛡️ Platform Admin</span>
                    {role === 'admin' && <span className="text-purple-600 text-xs">✓</span>}
                  </button>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      to="/"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Back to Landing Page</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            KRISHISETU PLATFORM
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50"
          >
            🌾 Home
          </Link>
          <Link
            to="/crop-analysis"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
          >
            🌱 Farm Intelligence
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100"
          >
            🚜 Farmer Marketplace
          </Link>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 pt-3 pb-1 border-t border-gray-100 mt-2">
            {role.toUpperCase()} NAVIGATION
          </div>
          {currentNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                location.pathname === link.path
                  ? 'bg-brand-50 text-brand-800 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {onOpenCalculator && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalculator();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-brand-700 bg-brand-50 flex items-center gap-2 mt-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Net Realization Calculator</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

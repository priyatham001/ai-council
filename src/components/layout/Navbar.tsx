import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  PhoneCall, 
  CalendarDays 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenParentLogin: () => void;
  onOpenTeacherLogin: () => void;
  onOpenAdmissionModal: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenParentLogin,
  onOpenTeacherLogin,
  onOpenAdmissionModal,
  onNavigateSection
}) => {
  const { currentUser, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Activities', href: '#activities' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Teachers', href: '#teachers' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Events', href: '#events' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(href.replace('#', ''));
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      {/* Top micro bar for school timing & phone */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 text-white text-[11px] sm:text-xs font-semibold py-1 px-4 text-center flex items-center justify-between">
        <span className="hidden sm:inline flex items-center gap-1.5 mx-auto sm:mx-0">
          🌈 <span className="font-bold">Admissions Open 2026-27!</span> Limited Seats for Playgroup, Nursery & UKG
        </span>
        <div className="flex items-center gap-4 ml-auto text-[11px]">
          <a href="tel:9581617315" className="flex items-center gap-1 hover:text-amber-100 font-bold transition-colors">
            <PhoneCall className="w-3 h-3" /> +91 9581617315
          </a>
          <span className="hidden md:inline">🕒 Mon - Sat: 8:00 AM - 6:30 PM</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <a
            id="brand-logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
              🧸
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading text-2xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
                  K for Kidz
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Play School
                </span>
                <span className="text-[10px] bg-rose-100/90 text-rose-800 border border-rose-200 font-black px-2 py-0.5 rounded-full shadow-2xs">
                  ✨ Kavitha for Kidz
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Where Little Minds Grow, Learn & Shine! 🌟
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3 py-2 rounded-xl hover:text-amber-600 hover:bg-amber-50/80 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs / User logged in buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-2xl">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-amber-300"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[10px] text-amber-700 font-semibold capitalize">
                      {role === 'parent' ? '👨‍👩‍👦 Parent' : '🍎 Teacher Desk'}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  title="Logout"
                  aria-label="Logout"
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Parent Login Button */}
                <button
                  id="btn-nav-parent-login"
                  onClick={onOpenParentLogin}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Parent Login</span>
                </button>

                {/* Teacher Login Button */}
                <button
                  id="btn-nav-teacher-login"
                  onClick={onOpenTeacherLogin}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Teacher Login</span>
                </button>

                {/* Book Tour CTA */}
                <button
                  id="btn-nav-book-tour"
                  onClick={onOpenAdmissionModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Book Campus Tour</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="w-10 h-10 rounded-xl bg-amber-100/70 text-slate-700 flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-amber-100 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800">{currentUser.displayName}</p>
                  <p className="text-[10px] text-amber-700 font-semibold">{currentUser.role.toUpperCase()} PORTAL ACTIVE</p>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenParentLogin();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs text-center"
                  >
                    👨‍👩‍👦 Parent Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTeacherLogin();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-xs text-center"
                  >
                    🍎 Teacher Login
                  </button>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmissionModal();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs text-center shadow-md"
                >
                  ✨ Book Campus Tour & Prospectus
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

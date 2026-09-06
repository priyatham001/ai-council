import React from 'react';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle 
} from 'lucide-react';

interface FooterProps {
  onOpenParentLogin: () => void;
  onOpenTeacherLogin: () => void;
  onOpenAdmissionModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenParentLogin,
  onOpenTeacherLogin,
  onOpenAdmissionModal
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden border-t-8 border-amber-400">
      {/* Decorative top rainbow stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-amber-400 via-emerald-400 to-sky-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                🧸
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading text-2xl font-bold text-white tracking-tight">
                    K for Kidz
                  </span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold uppercase">
                    Play School
                  </span>
                  <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                    ✨ Kavitha for Kidz
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 italic mt-0.5">“Where Little Minds Grow, Learn & Shine!”</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              At K for Kidz, every child is embraced as a unique spark of wonder. We combine play-based Montessori inquiry, emotional warmth, and safe modern infrastructure to prepare your child for school and life.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919160365486"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with K for Kidz on WhatsApp"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-3">
              <button
                id="btn-footer-book-tour"
                onClick={onOpenAdmissionModal}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Schedule Campus Visit</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-base flex items-center gap-2">
              <span>🎒</span> School Pages
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#about" className="hover:text-amber-300 transition-colors">Our Philosophy</a></li>
              <li><a href="#programs" className="hover:text-amber-300 transition-colors">Programs & Classes</a></li>
              <li><a href="#activities" className="hover:text-amber-300 transition-colors">Play Activities</a></li>
              <li><a href="#facilities" className="hover:text-amber-300 transition-colors">Campus Facilities</a></li>
              <li><a href="#teachers" className="hover:text-amber-300 transition-colors">Our Loving Teachers</a></li>
              <li><a href="#gallery" className="hover:text-amber-300 transition-colors">School Memories</a></li>
              <li><a href="#events" className="hover:text-amber-300 transition-colors">Upcoming Events</a></li>
            </ul>
          </div>

          {/* Portals & Admissions */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-base flex items-center gap-2">
              <span>🔐</span> Portals & Access
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  id="btn-footer-parent-login"
                  onClick={onOpenParentLogin}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>👨‍👩‍👦 Parent Portal (Live Daily)</span>
                </button>
              </li>
              <li>
                <button
                  id="btn-footer-teacher-login"
                  onClick={onOpenTeacherLogin}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🍎 Teacher Classroom Desk</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmissionModal}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📝 Admissions & Prospectus 2026</span>
                </button>
              </li>
              <li className="pt-2">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>ISO 9001:2015 Certified Early Childhood Center</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-base flex items-center gap-2">
              <span>📍</span> Campus Address
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Plot 24, Sunshine Boulevard, Near Rosewood Park, Sector 14, City Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:9160365486" className="hover:text-amber-300 font-semibold transition-colors">
                  +91 9160365486
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>admissions@kforkidz.edu</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <span className="text-white font-semibold">School Hours:</span> 8:30 AM - 1:00 PM<br />
                  <span className="text-white font-semibold">Day Care:</span> 8:00 AM - 6:30 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 K for Kidz (Kavitha for Kidz) Play School. All Rights Reserved. Designed with love for little learners.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400">Child Privacy Policy</a>
            <a href="#safety" className="hover:text-slate-400">Safety & Security Standards</a>
            <a href="#terms" className="hover:text-slate-400">Parent Handbook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

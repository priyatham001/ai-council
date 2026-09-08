import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '3 Years',
    program: 'Nursery (2.5 - 3.5 yrs)',
    phone: '',
    email: '',
    preferredDate: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div 
        id="admission-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            id="btn-close-admission-modal"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mb-2">
                Enquiry Received with Joy! 🎈
              </h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6">
                Thank you, <span className="font-semibold">{formData.parentName}</span>. Our admissions coordinator will call you at <span className="font-semibold">{formData.phone || '+91 9160365486'}</span> to schedule a fun campus discovery tour for <span className="font-semibold">{formData.childName || 'your child'}</span>!
              </p>
              <button
                id="btn-modal-done"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md"
              >
                Back to Website
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions Open for 2026 - 2027</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mb-1">
                Book a Free Campus Tour 🌈
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Come explore our child-safe classrooms, splash pool, and playful learning zones with your child.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Parent's Name *</label>
                    <input
                      id="input-parent-name"
                      type="text"
                      required
                      placeholder="e.g. Anita Sharma"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Child's Name *</label>
                    <input
                      id="input-child-name"
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Program of Interest *</label>
                    <select
                      id="select-program"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm bg-white"
                    >
                      <option>Toddler Playgroup (1.5 - 2.5 yrs)</option>
                      <option>Nursery (2.5 - 3.5 yrs)</option>
                      <option>Junior KG / LKG (3.5 - 4.5 yrs)</option>
                      <option>Senior KG / UKG (4.5 - 5.5 yrs)</option>
                      <option>Day Care & Fun Club (1.5 - 8 yrs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      id="input-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    id="input-email"
                    type="email"
                    placeholder="anita@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Questions or Special Notes</label>
                  <textarea
                    id="input-notes"
                    rows={2}
                    placeholder="Tell us about your child's interests or food preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  id="btn-submit-admission"
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Free Tour & Prospectus</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

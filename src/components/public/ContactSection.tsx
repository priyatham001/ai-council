import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FAQS } from '../../data/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare 
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Preschool Admission Inquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Preschool Admission Inquiry',
        message: ''
      });
    }, 3000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>📍</span>
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Visit Our Loving Campus Today 🏫
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about our programs, meals, or safety? Call us directly, send a note, or walk in during our morning reception hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Left: Contact Info & Map placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border-2 border-amber-200 space-y-5">
              <h3 className="text-xl font-bold font-heading text-slate-800">
                K for Kidz Play School
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800">Campus Address:</strong>
                    Plot 24, Sunshine Boulevard, Near Rosewood Park, Sector 14, City Center
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800">Helpdesk & Admissions:</strong>
                    <div className="flex flex-col gap-0.5">
                      <a href="tel:9160365486" className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline">
                        +91 9160365486
                      </a>
                      <a href="tel:9581617315" className="text-slate-600 hover:text-slate-800 text-xs hover:underline">
                        Alt: +91 9581617315
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800">Email:</strong>
                    admissions@kforkidz.edu / principal@kforkidz.edu
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800">School & Office Timings:</strong>
                    Monday - Friday: 8:00 AM - 6:30 PM<br />
                    Saturday: 9:00 AM - 2:00 PM (PTM & Visits)
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Map locator card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-200 shadow-sm aspect-[16/9] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
                alt="Map preview of school vicinity"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center p-4 text-center">
                <div className="bg-white/95 p-4 rounded-2xl shadow-xl max-w-xs">
                  <div className="text-2xl mb-1">📍</div>
                  <h4 className="font-heading font-bold text-sm text-slate-800">K for Kidz Play School</h4>
                  <p className="text-[11px] text-slate-500">Sector 14, Next to Rosewood Park</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-amber-600 hover:underline"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold font-heading text-slate-800 mb-1">
                Send Us a Quick Message 💬
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Our principal desk responds to all parent queries within 2 working hours.
              </p>

              {sent ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-xl text-slate-800">
                    Message Sent Successfully! 💌
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, <span className="font-bold">{formData.name || 'Parent'}</span>. We have received your inquiry and will reach out promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anita Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="anita@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                      >
                        <option>Preschool Admission Inquiry</option>
                        <option>Schedule a Campus Discovery Tour</option>
                        <option>Day Care & Fun Club Timings</option>
                        <option>Fee Structure & Transportation</option>
                        <option>General Feedback / Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Child Details *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please let us know your child's age, program of interest, or any specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Admissions Office</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* School FAQs Accordion */}
        <div className="bg-amber-50/50 p-6 sm:p-10 rounded-[36px] border-2 border-amber-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-bold font-heading text-slate-800 mb-1">
              Frequently Asked Questions (FAQs) 🤔
            </h3>
            <p className="text-xs text-slate-500">Quick answers to common questions asked by new parents</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:text-amber-700 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

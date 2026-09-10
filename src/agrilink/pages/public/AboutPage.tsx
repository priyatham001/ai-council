import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, HeartHandshake, Award, Sparkles, Scale, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          About KrishiSetu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Transforming Agricultural Marketing for Indian Farmers
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          KrishiSetu was conceived to solve the structural asymmetry between farm-gate realization and wholesale markets through transparent price discovery and AI decision support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Our Mission</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Empower every Indian farmer with transparent, net-realization data so that no crop is sold in distress due to lack of buyer access or transport visibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Net Realization First</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We eliminate the deceptive allure of distant high gross prices by deducting freight, hamali labour, and storage costs to reveal the true net cash in hand.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Guaranteed Trust</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every institutional buyer on KrishiSetu undergoes strict KYC, GST validation, and maintains a public on-time payment track record protected by digital escrow.
          </p>
        </div>
      </div>

      <div className="bg-emerald-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Built for Smart India Hackathon (SIH) 2026</h3>
          <p className="text-xs text-emerald-200 max-w-xl leading-relaxed">
            Engineered to seamlessly integrate with Agmarknet, e-NAM, state APMC portals, WDRA registered warehouses, and national UPI/e-RUPI payment rails.
          </p>
        </div>
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Launch Demo Platform</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

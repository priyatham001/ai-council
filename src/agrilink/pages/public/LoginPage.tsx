import React from 'react';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../../services/storageService';
import { UserRole } from '../../types';
import { BrandLogo } from '../../components/common/BrandLogo';
import { showToast } from '../../components/common/Toast';
import { User, Users, Building2, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    localStorageService.setRole(role);
    showToast({
      type: 'success',
      title: `Logged in as ${role.toUpperCase()}`,
      description: 'Role persisted in LocalStorage. Enjoy the demo!'
    });

    if (role === 'farmer') navigate('/farmer');
    else if (role === 'fpo') navigate('/fpo');
    else if (role === 'buyer') navigate('/buyer');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Select Demo Account
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Choose a persona below to explore KrishiSetu's role-tailored capabilities. No password required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 pt-2">
          {/* Farmer Card */}
          <button
            onClick={() => handleSelectRole('farmer')}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-brand-600 hover:bg-brand-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-brand-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Ramesh Varma (Farmer)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Primary Flow
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bhimavaram, Andhra Pradesh • 40q Tomato Lot • 4.5 Acres
                </p>
                <span className="text-[11px] font-mono text-gray-400">farmer@demo.com</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-700 group-hover:translate-x-1 transition-all" />
          </button>

          {/* FPO Card */}
          <button
            onClick={() => handleSelectRole('fpo')}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Godavari Farmers Producer Org</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    FPO Lead
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  128 Member Farmers • 1,890q Aggregated Produce • Undi Yard
                </p>
                <span className="text-[11px] font-mono text-gray-400">fpo@demo.com</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Buyer Card */}
          <button
            onClick={() => handleSelectRole('buyer')}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Sri Lakshmi Agro Foods</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Buyer
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Food Processing & Pulping • Tadepalligudem • KYC & GST Verified
                </p>
                <span className="text-[11px] font-mono text-gray-400">buyer@demo.com</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Admin Card */}
          <button
            onClick={() => handleSelectRole('admin')}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-600 hover:bg-purple-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">APMC & Platform Admin</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    Control Center
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mandi Supervision • Buyer Verification • Dispute Settlement
                </p>
                <span className="text-[11px] font-mono text-gray-400">admin@demo.com</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-gray-400">
            KrishiSetu Prototype • Instant switch available from top right role badge at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

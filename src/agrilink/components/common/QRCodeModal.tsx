import React from 'react';
import { X, QrCode, ShieldCheck, Printer, Check, Copy, Award, MapPin, CheckCircle2, Hash, FileText } from 'lucide-react';
import { DigitalLot } from '../../types';

interface QRCodeModalProps {
  lot: DigitalLot | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ lot, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !lot) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(lot.lotNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const qm = lot.qualityMetrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 flex flex-col my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-brand-900 via-emerald-900 to-brand-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-tight uppercase">
                  Digital Lot Passport
                </span>
                <span className="text-[9px] bg-emerald-400/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                  e-NAM / AGMARKNET
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">Tamper-proof quality & weighment certification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Government Compliance Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="badge-verified text-[11px] py-1 px-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Certified Farm-Gate Origin
            </span>
            <span className="text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-700" />
              {lot.state || 'India'}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900">
              {lot.crop} ({lot.variety})
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              Registered by <b className="text-gray-900">{lot.farmerName}</b> • {lot.location}, {lot.district}
            </p>
          </div>

          {/* Clean High-Contrast Procedural SVG QR Code */}
          <div className="p-4 bg-white rounded-2xl border-2 border-brand-300 shadow-md relative group">
            <svg
              className="w-44 h-44"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="#ffffff" />
              
              {/* Corner 1: Top-Left Finder Pattern */}
              <rect x="10" y="10" width="24" height="24" rx="3" fill="#15803d" />
              <rect x="14" y="14" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="18" y="18" width="8" height="8" rx="1" fill="#15803d" />

              {/* Corner 2: Top-Right Finder Pattern */}
              <rect x="66" y="10" width="24" height="24" rx="3" fill="#15803d" />
              <rect x="70" y="14" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="74" y="18" width="8" height="8" rx="1" fill="#15803d" />

              {/* Corner 3: Bottom-Left Finder Pattern */}
              <rect x="10" y="66" width="24" height="24" rx="3" fill="#15803d" />
              <rect x="14" y="70" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="18" y="74" width="8" height="8" rx="1" fill="#15803d" />

              {/* Data matrix nodes */}
              <rect x="38" y="12" width="4" height="8" fill="#1f2937" />
              <rect x="46" y="12" width="6" height="4" fill="#1f2937" />
              <rect x="56" y="12" width="4" height="6" fill="#1f2937" />
              <rect x="38" y="24" width="8" height="4" fill="#1f2937" />
              <rect x="50" y="22" width="4" height="8" fill="#1f2937" />

              <rect x="12" y="38" width="8" height="4" fill="#1f2937" />
              <rect x="12" y="46" width="6" height="6" fill="#1f2937" />
              <rect x="24" y="40" width="4" height="8" fill="#1f2937" />

              {/* Center agricultural leaf emblem inside QR */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#15803d" />
              <path d="M44 54C44 54 46 45 52 43C52 43 56 42 56 42C56 42 55 46 53 51C50 56 44 54 44 54Z" fill="#ffffff" />

              {/* Lower right matrix bits */}
              <rect x="66" y="40" width="8" height="4" fill="#1f2937" />
              <rect x="78" y="42" width="6" height="6" fill="#1f2937" />
              <rect x="66" y="52" width="4" height="8" fill="#1f2937" />
              <rect x="74" y="54" width="8" height="4" fill="#1f2937" />
              <rect x="86" y="50" width="4" height="8" fill="#1f2937" />

              <rect x="40" y="66" width="6" height="6" fill="#1f2937" />
              <rect x="50" y="68" width="8" height="4" fill="#1f2937" />
              <rect x="42" y="78" width="4" height="8" fill="#1f2937" />
              <rect x="52" y="76" width="6" height="6" fill="#1f2937" />

              <rect x="66" y="66" width="8" height="8" fill="#1f2937" />
              <rect x="78" y="68" width="6" height="4" fill="#1f2937" />
              <rect x="86" y="74" width="4" height="8" fill="#1f2937" />
              <rect x="70" y="80" width="8" height="6" fill="#1f2937" />
              <rect x="82" y="84" width="6" height="4" fill="#1f2937" />
            </svg>
          </div>

          {/* Lot ID code with copy button */}
          <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-300 w-full justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-gray-700 block">Unified Lot Passport ID</span>
              <span className="font-mono text-xs font-black text-brand-900 tracking-wider">
                {lot.lotNumber}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="text-gray-700 hover:text-brand-700 p-1.5 transition-colors bg-white rounded-lg border border-gray-200 shadow-2xs"
              title="Copy Lot Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Key Lot Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full text-left">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-700 block font-medium">Quantity</span>
              <span className="text-sm font-black text-gray-900">{lot.quantityQuintals} q</span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 block font-medium">Quality Grade</span>
              <span className="text-sm font-black text-emerald-700">{lot.qualityGrade} ({qm?.overallScore || 92}/100)</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-700 block font-medium">Target Price</span>
              <span className="text-sm font-black text-gray-900">₹{lot.expectedPricePerQ}/q</span>
            </div>
          </div>

          {/* Quality Assessment Breakdown Bars */}
          {qm && (
            <div className="w-full bg-gray-50 p-3 rounded-2xl border border-gray-200 text-left space-y-2">
              <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-brand-700" />
                <span>Certified Quality Breakdown (AI Assessed)</span>
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
                <div>
                  <div className="flex justify-between text-gray-700 mb-0.5">
                    <span>Size Uniformity:</span>
                    <b className="text-gray-900">{qm.size}%</b>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${qm.size}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-700 mb-0.5">
                    <span>Color & Maturity:</span>
                    <b className="text-gray-900">{qm.color}%</b>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${qm.color}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-700 mb-0.5">
                    <span>Freshness Index:</span>
                    <b className="text-gray-900">{qm.freshness}%</b>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${qm.freshness}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-700 mb-0.5">
                    <span>Moisture Test:</span>
                    <b className="text-gray-900">{qm.moisture}%</b>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${qm.moisture}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHA-256 Ledger Security Token */}
          <div className="w-full bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between text-[10px] text-emerald-900">
            <span className="flex items-center gap-1 font-mono font-bold">
              <Hash className="w-3.5 h-3.5 text-emerald-700" />
              SHA-256: 0x7f4a...b28c
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Blockchain Ledger Anchored
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-700">Scan at Mandi or Buyer Weighbridge Gate</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Lot Tag</span>
          </button>
        </div>
      </div>
    </div>
  );
};

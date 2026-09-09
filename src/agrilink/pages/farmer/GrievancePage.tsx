import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { grievanceService } from '../../services/grievanceService';
import { transactionService } from '../../services/transactionService';
import { Grievance, GrievanceCategory, Transaction } from '../../types';
import { showToast } from '../../components/common/Toast';

export const GrievancePage: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedTxnId, setSelectedTxnId] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('Payment Delay');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  useEffect(() => {
    const load = () => {
      setGrievances(grievanceService.getAll());
      const txns = transactionService.getAll();
      setTransactions(txns);
      if (txns.length > 0 && !selectedTxnId) {
        setSelectedTxnId(txns[0].id);
      }
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, [selectedTxnId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txn = transactions.find(t => t.id === selectedTxnId) || transactions[0];

    const grv = grievanceService.createGrievance({
      transactionId: txn?.id || 'txn-00421',
      transactionNumber: txn?.transactionNumber || 'SAL-TXN-00421',
      filedByName: 'Ramesh Varma',
      filedByRole: 'farmer',
      category,
      description,
      priority
    });

    setShowModal(false);
    setDescription('');
    showToast({
      type: 'warning',
      title: 'Dispute Ticket Logged',
      description: `Ticket ${grv.ticketNumber} assigned to APMC Escrow Oversight Cell.`
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-warning text-[11px]">Fair Trade Protection</span>
            <span className="text-[11px] bg-gray-100 text-gray-700 font-mono px-2 py-0.5 rounded font-bold">
              24-Hour Redressal SLA
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Grievance & Dispute Mechanism
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            File complaints regarding payment delays, quality disputes, or transport issues directly with the APMC Escrow Desk
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File New Grievance</span>
        </button>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {grievances.map((grv) => (
          <div
            key={grv.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">{grv.ticketNumber}</span>
                    <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                      {grv.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {grv.priority} Priority
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-700 mt-0.5">
                    Linked to Transaction: <span className="font-mono font-bold text-gray-900">{grv.transactionNumber}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  grv.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                }`}>
                  {grv.status}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              "{grv.description}"
            </p>

            {/* Admin Response Timeline */}
            {grv.adminResponse && (
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    APMC Dispute Redressal Cell Official Response:
                  </span>
                  <span className="text-[10px] text-gray-700 font-normal">
                    {new Date(grv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{grv.adminResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* File Complaint Modal (Section 22 Requirement) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-gray-100">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">File Formal Grievance</h3>
              <p className="text-xs text-gray-700">Submit a dispute ticket directly to the platform oversight board</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Disputed Transaction</label>
                <select
                  value={selectedTxnId}
                  onChange={(e) => setSelectedTxnId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                >
                  {transactions.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.transactionNumber} — {t.crop} ({t.quantityQuintals}q) with {t.buyerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Dispute Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                  >
                    <option value="Payment Delay">Payment Delay</option>
                    <option value="Quality Dispute">Quality Dispute</option>
                    <option value="Quantity Dispute">Quantity Dispute</option>
                    <option value="Transport Issue">Transport Issue</option>
                    <option value="Buyer Issue">Buyer Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                  >
                    <option value="High">High (Immediate Action)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the discrepancy, weighment slip mismatch, or payment delay timeline..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload className="w-4 h-4 text-gray-700" />
                <span className="font-semibold text-xs">Simulate Evidence Upload (Weighment Slip / Receipt)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

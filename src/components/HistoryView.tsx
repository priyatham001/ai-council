import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  Award,
  Filter,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { CouncilAnalysisDocument, CouncilMode } from '../../types/ai';
import { AnalysisResultView } from './AnalysisResultView';

interface HistoryViewProps {
  onSelectAnalysis?: (analysis: CouncilAnalysisDocument) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = () => {
  const [historyList, setHistoryList] = useState<CouncilAnalysisDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('ALL');
  const [activeAnalysis, setActiveAnalysis] = useState<CouncilAnalysisDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setHistoryList(data.history);
      }
    } catch {
      setErrorMsg('Failed to load history from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => (item.id || item._id) !== id));
        if (activeAnalysis && (activeAnalysis.id === id || activeAnalysis._id === id)) {
          setActiveAnalysis(null);
        }
      }
    } catch {
      alert('Failed to delete analysis record.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter list
  const filtered = historyList.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.finalAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = selectedModeFilter === 'ALL' || item.mode === selectedModeFilter;
    return matchesSearch && matchesMode;
  });

  // If viewing single record detail
  if (activeAnalysis) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <button
          onClick={() => setActiveAnalysis(null)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs font-semibold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Analysis History</span>
        </button>

        <AnalysisResultView
          analysis={activeAnalysis}
          onReset={() => setActiveAnalysis(null)}
        />
      </div>
    );
  }

  return (
    <div id="history-view-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Council Deliberation History
          </h1>
          <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
            Browse, re-inspect, and review previously synthesized council deliberations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-[#18181b] text-[#a1a1aa] border border-[#27272a] font-mono">
            {historyList.length} Records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries, models, or topics..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-xs sm:text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a1a1aa]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModeFilter}
            onChange={(e) => setSelectedModeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-xs sm:text-sm text-[#fafafa] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            <option value="QUICK">Quick</option>
            <option value="BALANCED">Balanced</option>
            <option value="DEEP ANALYSIS">Deep Analysis</option>
            <option value="DEBATE">Debate</option>
            <option value="CODING">Coding</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center text-[#a1a1aa] flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-xs">Fetching records from database...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#18181b] border border-[#27272a] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#09090b] text-[#a1a1aa] flex items-center justify-center mx-auto border border-[#27272a]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No History Records Found</h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
            {searchTerm || selectedModeFilter !== 'ALL'
              ? 'No historical inquiries match the selected filter criteria.'
              : 'Submit your first question to the AI Council to start preserving records.'}
          </p>
        </div>
      )}

      {/* Items list in Bento Card format */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item) => {
          const id = item.id || item._id || '';
          const isDeleting = deletingId === id;

          return (
            <div
              key={id}
              onClick={() => setActiveAnalysis(item)}
              className="p-5 rounded-xl bg-[#18181b] hover:bg-[#27272a]/50 border border-[#27272a] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#09090b] border border-[#27272a] text-[#a1a1aa] font-bold uppercase text-[10px]">
                    {item.mode}
                  </span>
                  <span className="flex items-center gap-1 text-[#71717a] text-[11px] font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.isDemo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800/60 text-purple-300 font-mono">
                      Demo
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#fafafa] group-hover:text-blue-400 transition-colors">
                  {item.question}
                </h3>

                <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                  {item.finalAnswer.replace(/[#*`]/g, '')}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#71717a]">
                  <span>{item.responses?.length || 0} Models Consulted</span>
                  <span>•</span>
                  <span>Confidence: {item.confidence || 90}%</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleDelete(id, e)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-[#09090b] transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-xs text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

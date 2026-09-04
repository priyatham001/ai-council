import React, { useState, useRef } from 'react';
import {
  Send,
  RotateCcw,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Zap,
  Sliders,
  Compass,
  Swords,
  Code2,
  Cpu,
  Info,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import {
  CouncilMode,
  AIProviderMeta,
  CouncilAnalysisDocument,
  FileAttachment,
} from '../../types/ai';
import { ProgressStage } from './ProgressStage';
import { AnalysisResultView } from './AnalysisResultView';

interface CouncilViewProps {
  providers: AIProviderMeta[];
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  defaultMode: CouncilMode;
  onAnalysisComplete: (analysis: CouncilAnalysisDocument) => void;
}

const MODES: { id: CouncilMode; label: string; desc: string; icon: any }[] = [
  { id: 'QUICK', label: 'Quick', desc: 'Fast, concise synthesis with core takeaways', icon: Zap },
  { id: 'BALANCED', label: 'Balanced', desc: 'Full multi-model cross-analysis & critique', icon: Sliders },
  { id: 'DEEP ANALYSIS', label: 'Deep Analysis', desc: 'Exhaustive critique of assumptions & edge cases', icon: Compass },
  { id: 'DEBATE', label: 'Debate', desc: 'Adversarial positions, counter-arguments & verdict', icon: Swords },
  { id: 'CODING', label: 'Coding', desc: 'Algorithm, complexity, code & bug diagnostics', icon: Code2 },
];

const EXAMPLE_QUESTIONS = [
  {
    mode: 'CODING' as CouncilMode,
    text: 'What is the best sorting algorithm for nearly sorted data?',
    tag: 'Algorithms',
  },
  {
    mode: 'CODING' as CouncilMode,
    text: 'Explain whether this Java code has a bug: public synchronized void transfer(...) without lock ordering.',
    tag: 'Bug Diagnosis',
  },
  {
    mode: 'DEBATE' as CouncilMode,
    text: 'Compare React client-side SPAs vs Next.js full-stack framework architecture.',
    tag: 'Architecture',
  },
  {
    mode: 'DEEP ANALYSIS' as CouncilMode,
    text: 'Which approach is better for implementing zero-trust network security in cloud infrastructure?',
    tag: 'Cybersecurity',
  },
];

export const CouncilView: React.FC<CouncilViewProps> = ({
  providers,
  demoMode,
  setDemoMode,
  defaultMode,
  onAnalysisComplete,
}) => {
  const [question, setQuestion] = useState('');
  const [selectedMode, setSelectedMode] = useState<CouncilMode>(defaultMode || 'BALANCED');
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['gemini']);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [stageText, setStageText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<CouncilAnalysisDocument | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const configuredCount = providers.filter((p) => p.configured).length;

  const handleProviderToggle = (id: string) => {
    if (selectedProviders.includes(id)) {
      if (selectedProviders.length === 1) return; // Keep at least one
      setSelectedProviders(selectedProviders.filter((p) => p !== id));
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            base64Content,
          }),
        });

        const data = await res.json();
        if (data.success && data.file) {
          setFiles((prev) => [...prev, data.file]);
        } else {
          setErrorMsg(data.error || 'Failed to process file.');
        }
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Error reading uploaded file.');
      setIsUploading(false);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleAnalyze = async () => {
    if (!question.trim() || question.trim().length < 3) {
      setErrorMsg('Please enter a question of at least 3 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);
    setCurrentStage(1);
    setStageText('Preparing question & validating parameters...');

    // Progress animation timeline
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 7) return 7;
        const next = prev + 1;
        const stageMessages = [
          'Preparing question & attachments',
          'Consulting independent AI providers',
          'Collecting independent responses',
          'Comparing answers & cross-analyzing',
          'Running adversarial critic & fact-checking',
          'Evaluating disagreements & edge cases',
          'Convening Supreme Judge for synthesis',
          'Saving analysis to database',
        ];
        setStageText(stageMessages[next - 1] || 'Analyzing...');
        return next;
      });
    }, 1800);

    try {
      const res = await fetch('/api/council/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          mode: selectedMode,
          selectedProviders,
          files,
          enableDemoMode: demoMode,
        }),
      });

      clearInterval(stageInterval);
      setCurrentStage(8);
      setStageText('Saving complete analysis to MongoDB...');

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Council pipeline failed.');
      }

      setCurrentStage(9);
      setStageText('Analysis complete.');
      setAnalysisResult(data.analysis);
      onAnalysisComplete(data.analysis);
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setErrorMsg((err as Error)?.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setFiles([]);
    setErrorMsg(null);
    setAnalysisResult(null);
  };

  return (
    <div id="council-view-wrapper" className="space-y-6 max-w-5xl mx-auto">
      {/* Header matching Bento Grid design */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#18181b] border border-[#27272a] text-[#a1a1aa] text-[11px] font-semibold uppercase tracking-wider">
            Deliberative Intelligence
          </span>
          {configuredCount === 1 && !demoMode && (
            <span className="px-2 py-0.5 rounded-full bg-[#18181b] border border-amber-900/50 text-amber-400 text-[11px] font-medium">
              1 AI provider active
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          New Council Analysis
        </h1>
        <p className="text-[#a1a1aa] text-sm">
          One Question. Multiple AIs. One Better Answer.
        </p>
      </header>

      {/* Input Form Card */}
      {!analysisResult && !isLoading && (
        <div
          id="question-input-card"
          className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-sm space-y-4"
        >
          {/* Question Textarea */}
          <div className="flex flex-col gap-2">
            <textarea
              id="council-question-textarea"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the Council a question or paste code to diagnose..."
              rows={3}
              className="bg-transparent text-lg border-none focus:ring-0 focus:outline-none resize-none w-full placeholder-[#3f3f46] text-[#fafafa] leading-relaxed"
              spellCheck="false"
            />
          </div>

          {/* Attached files preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#27272a]">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa]"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono truncate max-w-xs">{f.filename}</span>
                  <span className="text-[10px] text-[#71717a]">({(f.size / 1024).toFixed(1)} KB)</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-[#71717a] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.md,.pdf,.docx,.doc,.json,.js,.ts,.py,.java,.png,.jpg,.jpeg,.webp"
          />

          {/* Bottom Controls Row: Select mode, Upload docs, Analyze */}
          <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as CouncilMode)}
                className="bg-[#09090b] border border-[#27272a] text-xs px-3 py-1.5 rounded-md focus:outline-none text-[#fafafa] cursor-pointer"
              >
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} Analysis
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-[#09090b]"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading...' : files.length > 0 ? `+ Add Docs (${files.length})` : 'Upload Docs'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {question.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#71717a] hover:text-[#a1a1aa] px-2 py-1 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                id="analyze-submit-btn"
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !question.trim()}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#e4e4e7] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                Analyze
              </button>
            </div>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Bento Grid Configuration Tiles (When form is visible) */}
      {!analysisResult && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Example Queries Bento Tile */}
          <div className="md:col-span-7 bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-[#a1a1aa] mb-3 block">
                Sample Council Inquiries
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAMPLE_QUESTIONS.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuestion(ex.text);
                      setSelectedMode(ex.mode);
                    }}
                    className="p-2.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-left transition-colors cursor-pointer flex flex-col gap-1"
                  >
                    <span className="text-[10px] uppercase font-bold text-blue-400">{ex.tag}</span>
                    <span className="text-xs text-[#fafafa] line-clamp-2">{ex.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model Status & Simulation Bento Tile */}
          <div className="md:col-span-5 bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase text-[#a1a1aa]">
                  Active Providers
                </span>
                <button
                  type="button"
                  onClick={() => setDemoMode(!demoMode)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    demoMode
                      ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                      : 'bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
                  }`}
                >
                  {demoMode ? 'Demo Active' : 'Enable Demo'}
                </button>
              </div>

              <div className="space-y-2">
                {providers.map((p) => {
                  const isConfigured = p.configured;
                  const isSelected = selectedProviders.includes(p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => (!isConfigured && !demoMode ? null : handleProviderToggle(p.id))}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                        !isConfigured && !demoMode
                          ? 'opacity-40 bg-[#09090b] border-[#27272a]/50'
                          : isSelected
                          ? 'bg-[#09090b] border-[#27272a] text-[#fafafa] cursor-pointer'
                          : 'bg-[#09090b]/50 border-[#27272a]/50 text-[#71717a] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConfigured ? 'bg-green-500' : 'bg-[#71717a]'
                          }`}
                        />
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#71717a]">
                        {isConfigured ? 'Active' : demoMode ? 'Simulated' : 'Standby'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {configuredCount === 1 && !demoMode && (
              <p className="text-[11px] text-[#a1a1aa] mt-3 pt-3 border-t border-[#27272a] leading-tight">
                Single provider active. Enable Demo mode above to test full multi-model consensus & debate.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Live Deliberation Progress State */}
      {isLoading && (
        <ProgressStage currentStage={currentStage} stageText={stageText} />
      )}

      {/* Deliberation Completed: Result View */}
      {analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          onReset={handleClear}
        />
      )}
    </div>
  );
};

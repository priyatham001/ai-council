import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Paperclip,
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
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  ShieldCheck,
  Award,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  CouncilMode,
  AIProviderMeta,
  CouncilAnalysisDocument,
  FileAttachment,
  ProviderResponse,
} from '../../types/ai';
import { MarkdownView } from './MarkdownView';
import { submitCouncilAnalysis, uploadAttachment } from '../lib/api';

interface CouncilViewProps {
  providers: AIProviderMeta[];
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  defaultMode: CouncilMode;
  onAnalysisComplete: (analysis: CouncilAnalysisDocument) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: CouncilMode;
  files?: FileAttachment[];
  analysis?: CouncilAnalysisDocument;
  error?: string;
  isDeliberating?: boolean;
  stageText?: string;
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
    text: 'What is the optimal algorithm for finding duplicates in an unsorted array with O(1) extra space?',
    tag: 'Algorithms',
  },
  {
    mode: 'DEBATE' as CouncilMode,
    text: 'Should modern web applications prefer micro-frontends or modular monoliths? Compare trade-offs.',
    tag: 'Architecture',
  },
  {
    mode: 'DEEP ANALYSIS' as CouncilMode,
    text: 'How does zero-knowledge proof technology enable confidential transactions on public ledgers?',
    tag: 'Cryptography',
  },
  {
    mode: 'BALANCED' as CouncilMode,
    text: 'Explain quantum computing decoherence and why error correction is the primary engineering bottleneck.',
    tag: 'Physics',
  },
];

const DELIBERATION_STAGES = [
  'Querying Gemini, OpenAI GPT, Anthropic Claude, and Mistral in parallel...',
  'Collecting independent perspectives from all frontier models...',
  'Cross-Analyzer identifying consensus, agreements, and subtle contradictions...',
  'Adversarial Critic testing claims, edge cases, and fact-checking...',
  'Supreme Judge synthesizing verified insights into one optimal answer...',
];

export const CouncilView: React.FC<CouncilViewProps> = ({
  providers,
  demoMode,
  setDemoMode,
  defaultMode,
  onAnalysisComplete,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<CouncilMode>(defaultMode || 'BALANCED');
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);
  const [activeTabByMessage, setActiveTabByMessage] = useState<Record<string, 'models' | 'analysis' | 'critic' | 'judge'>>({});
  const [activeModelTabByMessage, setActiveModelTabByMessage] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on message updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Reset conversation
  const handleNewSession = () => {
    if (messages.length > 0 && !confirm('Start a new Council session? Your previous questions remain saved in History.')) {
      return;
    }
    setMessages([]);
    setInput('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const uploadRes = await uploadAttachment({
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            base64Content: base64,
          });

          const attachment = uploadRes.attachment || uploadRes.file;
          if (attachment) {
            setAttachedFiles((prev) => [...prev, attachment]);
          } else {
            // Local fallback attachment representation
            const fallbackAttachment: FileAttachment = {
              filename: file.name,
              mimeType: file.type || 'text/plain',
              size: file.size,
              uploadedAt: new Date().toISOString(),
            };
            setAttachedFiles((prev) => [...prev, fallbackAttachment]);
          }
        } catch (err: any) {
          alert(`Upload failed: ${err.message || 'Unknown error'}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const removeAttachedFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit question to AI Council
  const handleSubmit = async (overrideText?: string) => {
    const questionText = (overrideText || input).trim();
    if (!questionText || isSubmitting) return;

    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `asst_${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: questionText,
      timestamp: new Date().toISOString(),
      mode: selectedMode,
      files: [...attachedFiles],
    };

    const pendingAssistantMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      mode: selectedMode,
      isDeliberating: true,
      stageText: DELIBERATION_STAGES[0],
    };

    setMessages((prev) => [...prev, userMsg, pendingAssistantMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsSubmitting(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Dynamic stage ticker
    let stageIndex = 0;
    const interval = setInterval(() => {
      stageIndex = (stageIndex + 1) % DELIBERATION_STAGES.length;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, stageText: DELIBERATION_STAGES[stageIndex] }
            : msg
        )
      );
    }, 2800);

    try {
      const result = await submitCouncilAnalysis({
        question: questionText,
        mode: selectedMode,
        files: userMsg.files,
        enableDemoMode: demoMode,
      });

      clearInterval(interval);

      if (result.success && result.analysis) {
        const finalAnswer = result.finalAnswer || result.analysis.finalAnswer;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: finalAnswer,
                  analysis: result.analysis,
                  isDeliberating: false,
                  stageText: undefined,
                }
              : msg
          )
        );

        onAnalysisComplete(result.analysis);
      } else {
        throw new Error(result.error || 'Failed to obtain AI Council synthesis.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                isDeliberating: false,
                error:
                  err?.message ||
                  'The AI Council encountered an error connecting to the providers. Please verify your keys or try Demo Mode in Settings.',
              }
            : msg
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const configuredProviders = providers.filter((p) => p.configured);
  const providerCount = configuredProviders.length > 0 ? configuredProviders.length : 4;
  const isSimulated = demoMode || configuredProviders.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] max-w-5xl mx-auto w-full">
      {/* Top Session Bar */}
      <header className="flex items-center justify-between pb-3 mb-2 border-b border-[#27272a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-sm tracking-tight text-white">AI Council</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-medium">
                  {providerCount} Models Active
                </span>
                {isSimulated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#71717a] hidden sm:block">
                Gemini • GPT-4o • Claude 3.5 • Mistral Large
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleNewSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-medium text-[#d4d4d8] hover:text-white transition-colors"
              title="Start fresh conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Council</span>
            </button>
          )}

          {/* Mode Pill Dropdown */}
          <div className="relative group">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as CouncilMode)}
              className="appearance-none bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-medium text-[#d4d4d8] rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} Mode
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717a] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-4 space-y-6">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/10 mb-4 ring-1 ring-white/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              One Question → Multiple AIs → One Better Answer
            </h2>
            <p className="text-sm text-[#a1a1aa] max-w-lg mb-6 leading-relaxed">
              Submit any question. All active AI providers run in parallel. The Cross-Analyzer compares
              perspectives, the Critic scrutinizes contradictions, and the Supreme Judge synthesizes the
              single highest-quality answer.
            </p>

            {/* Provider Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8]">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Google Gemini
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                OpenAI GPT-4o
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8]">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Anthropic Claude 3.5
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8]">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Mistral Large
              </span>
            </div>

            {/* Suggested Prompts */}
            <div className="w-full text-left">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-wider block mb-3">
                Suggested Council Inquiries
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXAMPLE_QUESTIONS.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMode(ex.mode);
                      handleSubmit(ex.text);
                    }}
                    className="p-3.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] text-left transition-all group flex flex-col justify-between"
                  >
                    <span className="text-xs font-medium text-[#e4e4e7] group-hover:text-white line-clamp-2 mb-2">
                      "{ex.text}"
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                      <span className="font-mono text-blue-400">{ex.mode}</span>
                      <span>{ex.tag}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Message Stream */
          messages.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {msg.role === 'user' ? (
                /* User Message Bubble */
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm">
                    <div className="text-xs text-blue-200 mb-1 flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">You</span>
                      <span>•</span>
                      <span className="text-[10px] opacity-80">{msg.mode} Mode</span>
                    </div>
                    <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Attached files if any */}
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-blue-500/40 flex flex-wrap gap-1.5">
                        {msg.files.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-700/60 text-xs text-blue-100"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{f.filename}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Assistant / AI Council Response */
                <div className="flex flex-col gap-2">
                  <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 sm:p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27272a]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-white">AI Council Verdict</span>
                          <span className="text-xs text-[#71717a] ml-2 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.analysis && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                            {msg.analysis.confidence || 92}% Confidence
                          </span>
                        )}
                        {msg.content && (
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="p-1.5 rounded-md hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors"
                            title="Copy final answer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Deliberating Progress State */}
                    {msg.isDeliberating ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin flex items-center justify-center" />
                          <Sparkles className="w-5 h-5 text-blue-400 absolute inset-0 m-auto" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-1">
                            The Council is deliberating
                          </p>
                          <p className="text-xs text-[#a1a1aa] font-mono animate-pulse">
                            {msg.stageText || 'Querying all configured models in parallel...'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
                          <span>Gemini</span> • <span>GPT-4o</span> • <span>Claude 3.5</span> • <span>Mistral</span>
                        </div>
                      </div>
                    ) : msg.error ? (
                      /* Error State */
                      <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-200">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-red-300">Council Deliberation Error</h4>
                            <p className="text-xs text-red-200/90 mt-1 leading-relaxed">{msg.error}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <button
                                onClick={() => handleSubmit(messages[messages.length - 2]?.content)}
                                className="px-3 py-1 rounded bg-red-900/80 hover:bg-red-800 text-xs font-medium text-white transition-colors"
                              >
                                Retry Inquiry
                              </button>
                              <span className="text-[11px] text-red-300/70">
                                You can also enable Demo Mode in Settings to test without API keys.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Synthesized Final Markdown Answer */
                      <div className="space-y-4">
                        <div className="text-sm sm:text-base leading-relaxed text-[#e4e4e7]">
                          <MarkdownView content={msg.content} />
                        </div>

                        {/* Collapsible Council Deliberation Section */}
                        {msg.analysis && (
                          <div className="pt-4 border-t border-[#27272a]">
                            <button
                              onClick={() =>
                                setExpandedDetailsId(
                                  expandedDetailsId === msg.id ? null : msg.id
                                )
                              }
                              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#09090b] hover:bg-[#1f1f23] border border-[#27272a] text-xs font-medium text-[#d4d4d8] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-400" />
                                <span>Council Deliberation & Proof</span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#27272a] text-[#a1a1aa]">
                                  {msg.analysis.responses.length} Models Consulted
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[#a1a1aa]">
                                <span>{expandedDetailsId === msg.id ? 'Hide Details' : 'Inspect Raw Deliberation'}</span>
                                {expandedDetailsId === msg.id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </button>

                            {/* Expanded Deliberation Panel */}
                            {expandedDetailsId === msg.id && (
                              <div className="mt-3 p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-4 animate-fadeIn">
                                {/* Navigation Tabs for Deliberation Details */}
                                <div className="flex items-center gap-1 pb-2 border-b border-[#27272a] overflow-x-auto text-xs">
                                  <button
                                    onClick={() =>
                                      setActiveTabByMessage((prev) => ({
                                        ...prev,
                                        [msg.id]: 'models',
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                      (activeTabByMessage[msg.id] || 'models') === 'models'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                                    }`}
                                  >
                                    1. Frontier Models ({msg.analysis.responses.length})
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActiveTabByMessage((prev) => ({
                                        ...prev,
                                        [msg.id]: 'analysis',
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                      activeTabByMessage[msg.id] === 'analysis'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                                    }`}
                                  >
                                    2. Cross-Analyzer
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActiveTabByMessage((prev) => ({
                                        ...prev,
                                        [msg.id]: 'critic',
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                      activeTabByMessage[msg.id] === 'critic'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                                    }`}
                                  >
                                    3. Adversarial Critic
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActiveTabByMessage((prev) => ({
                                        ...prev,
                                        [msg.id]: 'judge',
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                      activeTabByMessage[msg.id] === 'judge'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                                    }`}
                                  >
                                    4. Supreme Judge Verdict
                                  </button>
                                </div>

                                {/* TAB 1: Frontier Models Independent Answers */}
                                {(activeTabByMessage[msg.id] || 'models') === 'models' && (
                                  <div className="space-y-3">
                                    {/* Model Selector Pills */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {msg.analysis.responses.map((resp) => {
                                        const activeModel =
                                          activeModelTabByMessage[msg.id] ||
                                          msg.analysis?.responses[0]?.provider;
                                        const isSelected = activeModel === resp.provider;
                                        return (
                                          <button
                                            key={resp.provider}
                                            onClick={() =>
                                              setActiveModelTabByMessage((prev) => ({
                                                ...prev,
                                                [msg.id]: resp.provider,
                                              }))
                                            }
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                              isSelected
                                                ? 'bg-[#27272a] text-white border-[#3f3f46]'
                                                : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:text-white'
                                            }`}
                                          >
                                            <span
                                              className={`w-2 h-2 rounded-full ${
                                                resp.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                                              }`}
                                            />
                                            <span>{resp.providerName}</span>
                                            <span className="text-[10px] text-[#71717a] font-mono">
                                              {(resp.responseTime / 1000).toFixed(1)}s
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Active Model Content Card */}
                                    {(() => {
                                      const activeModelId =
                                        activeModelTabByMessage[msg.id] ||
                                        msg.analysis.responses[0]?.provider;
                                      const selectedResp =
                                        msg.analysis.responses.find((r) => r.provider === activeModelId) ||
                                        msg.analysis.responses[0];

                                      if (!selectedResp) return null;

                                      return (
                                        <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3">
                                          <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                                            <div>
                                              <span className="font-semibold text-xs text-white">
                                                {selectedResp.providerName}
                                              </span>
                                              <span className="text-[11px] text-[#71717a] ml-2 font-mono">
                                                Model: {selectedResp.model}
                                              </span>
                                            </div>
                                            <span
                                              className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                                                selectedResp.status === 'success'
                                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                                  : 'bg-red-950 text-red-300 border border-red-800'
                                              }`}
                                            >
                                              {selectedResp.status}
                                            </span>
                                          </div>

                                          {selectedResp.error ? (
                                            <div className="p-3 rounded-lg bg-red-950/50 border border-red-900 text-xs text-red-300">
                                              {selectedResp.error}
                                            </div>
                                          ) : (
                                            <div className="max-h-96 overflow-y-auto pr-2 text-xs leading-relaxed text-[#d4d4d8]">
                                              <MarkdownView content={selectedResp.answer} />
                                            </div>
                                          )}

                                          {/* Key Claims & Uncertainties */}
                                          {selectedResp.keyClaims && selectedResp.keyClaims.length > 0 && (
                                            <div className="pt-2 border-t border-[#27272a]">
                                              <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider block mb-1">
                                                Key Assertions
                                              </span>
                                              <ul className="list-disc list-inside text-xs text-[#a1a1aa] space-y-0.5">
                                                {selectedResp.keyClaims.slice(0, 3).map((claim, cIdx) => (
                                                  <li key={cIdx}>{claim}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}

                                {/* TAB 2: Cross-Analysis */}
                                {activeTabByMessage[msg.id] === 'analysis' && (
                                  <div className="space-y-3 text-xs">
                                    <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                      <h5 className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Unanimous Multi-Model Consensus
                                      </h5>
                                      <ul className="list-disc list-inside text-[#a1a1aa] space-y-1">
                                        {msg.analysis.analysis.consensus.map((c, i) => (
                                          <li key={i}>{c}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {msg.analysis.analysis.disagreements.length > 0 && (
                                      <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                        <h5 className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          Model Disagreements & Divergences
                                        </h5>
                                        <ul className="list-disc list-inside text-[#a1a1aa] space-y-1">
                                          {msg.analysis.analysis.disagreements.map((d, i) => (
                                            <li key={i}>{d}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {msg.analysis.analysis.missingInformation.length > 0 && (
                                      <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                        <h5 className="font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                                          <Info className="w-3.5 h-3.5" />
                                          Missing Edge Cases / Context
                                        </h5>
                                        <ul className="list-disc list-inside text-[#a1a1aa] space-y-1">
                                          {msg.analysis.analysis.missingInformation.map((m, i) => (
                                            <li key={i}>{m}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* TAB 3: Adversarial Critic */}
                                {activeTabByMessage[msg.id] === 'critic' && (
                                  <div className="space-y-3 text-xs">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                      <span className="font-medium text-[#d4d4d8]">Critic Reliability Verdict:</span>
                                      <span
                                        className={`px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                                          msg.analysis.critic.reliabilityVerdict === 'reliable'
                                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                                        }`}
                                      >
                                        {msg.analysis.critic.reliabilityVerdict}
                                      </span>
                                    </div>

                                    {msg.analysis.critic.criticalErrors.length > 0 && (
                                      <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-200">
                                        <span className="font-semibold block mb-1">Critical Errors Flagged:</span>
                                        <ul className="list-disc list-inside space-y-1 text-red-300">
                                          {msg.analysis.critic.criticalErrors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {msg.analysis.critic.unsupportedClaims.length > 0 && (
                                      <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                        <span className="font-semibold text-amber-300 block mb-1">
                                          Unsupported Claims Scrutinized:
                                        </span>
                                        <ul className="list-disc list-inside text-[#a1a1aa] space-y-1">
                                          {msg.analysis.critic.unsupportedClaims.map((claim, i) => (
                                            <li key={i}>{claim}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {msg.analysis.critic.importantCorrections.length > 0 && (
                                      <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                                        <span className="font-semibold text-blue-300 block mb-1">
                                          Mandatory Corrections Enforced by Judge:
                                        </span>
                                        <ul className="list-disc list-inside text-[#a1a1aa] space-y-1">
                                          {msg.analysis.critic.importantCorrections.map((corr, i) => (
                                            <li key={i}>{corr}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* TAB 4: Supreme Judge Verdict */}
                                {activeTabByMessage[msg.id] === 'judge' && (
                                  <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                                      <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-400" />
                                        <span className="font-semibold text-white">Supreme Judge Synthesis</span>
                                      </div>
                                      <span className="font-mono text-emerald-400 font-bold">
                                        Confidence: {msg.analysis.decision?.confidence || msg.analysis.confidence || 92}%
                                      </span>
                                    </div>
                                    <p className="text-[#a1a1aa] leading-relaxed">
                                      {msg.analysis.decision?.decisionSummary ||
                                        'The supreme judge unified the strongest factual points, discarded hallucinations, and integrated the adversarial critic corrections into one definitive answer.'}
                                    </p>
                                    {msg.analysis.decision?.uncertainty && msg.analysis.decision.uncertainty.length > 0 && (
                                      <div className="pt-2 border-t border-[#27272a]">
                                        <span className="font-semibold text-[#71717a] block mb-1 uppercase tracking-wider text-[10px]">
                                          Noted Uncertainties & Assumptions
                                        </span>
                                        <ul className="list-disc list-inside text-[#71717a] space-y-0.5">
                                          {msg.analysis.decision.uncertainty.map((u, i) => (
                                            <li key={i}>{u}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Fixed at Bottom */}
      <div className="pt-2 pb-2 shrink-0">
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8]"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[180px]">{file.filename}</span>
                <button
                  onClick={() => removeAttachedFile(idx)}
                  className="p-0.5 hover:text-white rounded hover:bg-[#27272a]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Box Container */}
        <div className="relative rounded-2xl bg-[#18181b] border border-[#27272a] focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all p-3 shadow-md">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={`Ask the AI Council any question in ${selectedMode.toLowerCase()} mode... (Enter to send, Shift+Enter for new line)`}
            rows={1}
            disabled={isSubmitting}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#71717a] resize-none focus:outline-none max-h-48 overflow-y-auto leading-relaxed"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#27272a]/60">
            <div className="flex items-center gap-2">
              {/* File Attachment Button */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.md,.json,.csv,.pdf,.doc,.docx,image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting}
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors flex items-center gap-1 text-xs"
                title="Attach file (text, PDF, documents, image)"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-[11px]">Attach</span>
              </button>

              {/* Mode Selector Pill */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#09090b] border border-[#27272a] text-[11px] text-[#a1a1aa]">
                <span className="text-white font-medium">{selectedMode}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#71717a] hidden md:inline">
                All 4 AIs participate in parallel
              </span>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isSubmitting}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-[#27272a] disabled:text-[#71717a] text-white transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                title="Send inquiry to Council"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

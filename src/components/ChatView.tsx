import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  X,
  Copy,
  Check,
  RotateCcw,
  Compass,
  Zap,
  Sliders,
  Swords,
  Code2,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  AlertCircle,
  FileText,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  CouncilMode,
  AIProviderMeta,
  CouncilAnalysisDocument,
  FileAttachment,
  ChatMessage,
  ChatConversation,
  ProviderResponse,
} from '../types';
import { MarkdownView } from './MarkdownView';
import { parseJsonResponse } from '../lib/apiClient';

interface ChatViewProps {
  providers: AIProviderMeta[];
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  defaultMode: CouncilMode;
  onAnalysisComplete?: (analysis: CouncilAnalysisDocument) => void;
  onOpenMap?: (prompt?: string) => void;
  activeConversation?: ChatConversation | null;
  onNewChat?: () => void;
  onSaveConversation?: (conversation: ChatConversation) => void;
}

const MODES: { id: CouncilMode; label: string; desc: string; icon: any }[] = [
  { id: 'BALANCED', label: 'Balanced', desc: 'Full multi-model cross-analysis & synthesis', icon: Sliders },
  { id: 'QUICK', label: 'Quick', desc: 'Fast, concise consensus synthesis', icon: Zap },
  { id: 'DEEP ANALYSIS', label: 'Deep Analysis', desc: 'Exhaustive verification of assumptions & edge cases', icon: Compass },
  { id: 'DEBATE', label: 'Debate', desc: 'Adversarial positions, dialectic rebuttals & final verdict', icon: Swords },
  { id: 'CODING', label: 'Coding', desc: 'Algorithmic proof, complexity, code & bug diagnostics', icon: Code2 },
];

const STARTER_PROMPTS = [
  {
    title: 'Explain binary search in Java with edge cases',
    mode: 'CODING' as CouncilMode,
    icon: Code2,
  },
  {
    title: 'What is the difference between an array and a linked list?',
    mode: 'BALANCED' as CouncilMode,
    icon: Sliders,
  },
  {
    title: 'Compare React client-side SPA vs Next.js full-stack framework',
    mode: 'DEBATE' as CouncilMode,
    icon: Swords,
  },
  {
    title: 'Zero-trust network security architectural guidelines in the cloud',
    mode: 'DEEP ANALYSIS' as CouncilMode,
    icon: Compass,
  },
  {
    title: 'Analyze Silicon Valley vs Bengaluru AI engineering ecosystems',
    mode: 'BALANCED' as CouncilMode,
    icon: MapPin,
  },
];

export const ChatView: React.FC<ChatViewProps> = ({
  providers,
  demoMode,
  setDemoMode,
  defaultMode,
  onAnalysisComplete,
  onOpenMap,
  activeConversation: initialConversation,
  onNewChat,
  onSaveConversation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedMode, setSelectedMode] = useState<CouncilMode>(defaultMode || 'BALANCED');
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  const [analysisActiveTab, setAnalysisActiveTab] = useState<Record<string, 'providers' | 'cross' | 'critic' | 'judge'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>(() => 'chat_' + Date.now());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore conversation if passed from props
  useEffect(() => {
    if (initialConversation) {
      setMessages(initialConversation.messages || []);
      setConversationId(initialConversation.id);
      setSelectedMode(initialConversation.mode || defaultMode);
    }
  }, [initialConversation, defaultMode]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputQuestion]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string)?.split(',')[1];
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

        const result = await parseJsonResponse<{ success: boolean; file?: FileAttachment; error?: string }>(res);
        if (result.ok && result.data?.success && result.data.file) {
          setFiles((prev) => [...prev, result.data!.file!]);
        } else {
          alert(result.error || result.data?.error || 'Failed to upload file.');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Error reading uploaded file.');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCopyAnswer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendQuestion = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt || inputQuestion).trim();
    if (!promptToSend || isLoading) return;

    const userMessageId = 'msg_user_' + Date.now();
    const councilMessageId = 'msg_council_' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: promptToSend,
      timestamp,
      files: files.length > 0 ? [...files] : undefined,
      mode: selectedMode,
    };

    const initialCouncilMessage: ChatMessage = {
      id: councilMessageId,
      role: 'council',
      content: '',
      timestamp,
      mode: selectedMode,
      isThinking: true,
      progress: {
        stage: 'Consulting all AI providers in parallel...',
        stepIndex: 2,
        providerStatuses: {
          gemini: 'thinking',
          openai: 'thinking',
          anthropic: 'thinking',
          mistral: 'thinking',
        },
        stageStatuses: {
          analyzer: 'pending',
          critic: 'pending',
          judge: 'pending',
        },
      },
    };

    const updatedMessages = [...messages, userMessage, initialCouncilMessage];
    setMessages(updatedMessages);
    setInputQuestion('');
    setFiles([]);
    setIsLoading(true);

    // Staged progress simulation while backend resolves
    const stage1Timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === councilMessageId
            ? {
                ...msg,
                progress: {
                  ...msg.progress!,
                  stage: 'Collecting independent answers...',
                  stepIndex: 3,
                  providerStatuses: {
                    gemini: 'completed',
                    openai: 'completed',
                    anthropic: 'thinking',
                    mistral: 'completed',
                  },
                },
              }
            : msg
        )
      );
    }, 1800);

    const stage2Timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === councilMessageId
            ? {
                ...msg,
                progress: {
                  ...msg.progress!,
                  stage: 'Cross-Analyzing agreements, conflicts & claims...',
                  stepIndex: 4,
                  providerStatuses: {
                    gemini: 'completed',
                    openai: 'completed',
                    anthropic: 'completed',
                    mistral: 'completed',
                  },
                  stageStatuses: {
                    analyzer: 'thinking',
                    critic: 'pending',
                    judge: 'pending',
                  },
                },
              }
            : msg
        )
      );
    }, 3200);

    const stage3Timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === councilMessageId
            ? {
                ...msg,
                progress: {
                  ...msg.progress!,
                  stage: 'Adversarial fact-checking & bias verification...',
                  stepIndex: 5,
                  stageStatuses: {
                    analyzer: 'completed',
                    critic: 'thinking',
                    judge: 'pending',
                  },
                },
              }
            : msg
        )
      );
    }, 4800);

    const stage4Timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === councilMessageId
            ? {
                ...msg,
                progress: {
                  ...msg.progress!,
                  stage: 'Supreme Judge synthesizing optimal consensus...',
                  stepIndex: 6,
                  stageStatuses: {
                    analyzer: 'completed',
                    critic: 'completed',
                    judge: 'thinking',
                  },
                },
              }
            : msg
        )
      );
    }, 6200);

    try {
      const res = await fetch('/api/council/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptToSend,
          mode: selectedMode,
          files: userMessage.files,
          enableDemoMode: demoMode,
        }),
      });

      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(stage4Timer);

      const parsed = await parseJsonResponse<{
        success: boolean;
        analysis?: CouncilAnalysisDocument;
        error?: string;
      }>(res);

      if (parsed.ok && parsed.data?.success && parsed.data.analysis) {
        const analysis = parsed.data.analysis;

        const finalCouncilMessage: ChatMessage = {
          id: councilMessageId,
          role: 'council',
          content: analysis.finalAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: selectedMode,
          analysis,
          isThinking: false,
        };

        const finalMessages = [...messages, userMessage, finalCouncilMessage];
        setMessages(finalMessages);

        // Notify parent of analysis completion
        onAnalysisComplete?.(analysis);

        // Save conversation state
        const conversation: ChatConversation = {
          id: conversationId,
          title: promptToSend.slice(0, 48),
          createdAt: new Date().toISOString(),
          mode: selectedMode,
          messages: finalMessages,
          providersCount: analysis.responses?.length || 4,
        };
        onSaveConversation?.(conversation);
      } else {
        const errorMessage =
          parsed.error || parsed.data?.error || 'Council analysis failed. Please try again.';

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === councilMessageId
              ? {
                  ...msg,
                  isThinking: false,
                  error: errorMessage,
                  content: `⚠️ **Council Deliberation Error:**\n\n${errorMessage}\n\n*You can try enabling Demo Simulation Mode in Settings or selecting a different analysis mode.*`,
                }
              : msg
          )
        );
      }
    } catch (err: unknown) {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(stage4Timer);

      const errorText = (err as Error)?.message || 'Network communication error.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === councilMessageId
            ? {
                ...msg,
                isThinking: false,
                error: errorText,
                content: `⚠️ **Council Connection Error:** ${errorText}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setInputQuestion('');
    setFiles([]);
    setConversationId('chat_' + Date.now());
    onNewChat?.();
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <div
      id="chat-view-container"
      className="flex flex-col h-full w-full max-w-4xl mx-auto relative antialiased"
    >
      {/* Top Conversation Header */}
      <div className="flex items-center justify-between py-2 px-4 border-b border-[#27272a]/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-xs">
            <div className="w-3.5 h-3.5 border-2 border-[#09090b] rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white">AI Council</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                4 Providers Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Maps Button */}
          {onOpenMap && (
            <button
              onClick={() => onOpenMap()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white border border-[#27272a] text-xs font-medium transition-colors cursor-pointer"
              title="Open Google Maps Platform Explorer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Google Maps</span>
            </button>
          )}

          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white border border-[#27272a] text-xs font-medium transition-colors cursor-pointer"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty / Initial State: Clean ChatGPT-style welcome */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-xl mx-auto px-4 py-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/5 mb-4">
              <div className="w-6 h-6 border-2 border-[#09090b] rotate-45" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              AI Council
            </h1>
            <p className="text-sm font-medium text-blue-400 mb-1">
              One Question. Multiple AIs. One Better Answer.
            </p>
            <p className="text-xs text-[#71717a] max-w-md mb-8">
              Every question is processed in parallel by Gemini, GPT-4o, Claude, and Mistral, then cross-analyzed, critiqued for errors, and synthesized by the Supreme Judge.
            </p>

            {/* Quick Starter Pills */}
            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider block px-1">
                Suggested Deliberations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMode(prompt.mode);
                        handleSendQuestion(prompt.title);
                      }}
                      className="p-3 rounded-xl bg-[#121214] hover:bg-[#18181b] border border-[#27272a] text-left text-xs text-[#a1a1aa] hover:text-white transition-all group flex items-start gap-2.5 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-[#1c1c1f] group-hover:bg-blue-600/10 group-hover:text-blue-400 border border-[#27272a] text-[#71717a] transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug pt-0.5">{prompt.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Messages */
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const analysis = msg.analysis;
            const isExpanded = expandedAnalysisId === msg.id;
            const activeTab = analysisActiveTab[msg.id] || 'providers';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto w-full'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#18181b] border border-[#27272a] text-white'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <div className="w-3.5 h-3.5 border-2 border-white rotate-45" />
                  )}
                </div>

                {/* Message Bubble Content */}
                <div
                  className={`flex flex-col space-y-2 ${
                    isUser ? 'items-end max-w-[85%]' : 'w-full max-w-[92%]'
                  }`}
                >
                  {/* User Message */}
                  {isUser ? (
                    <div className="p-3.5 rounded-2xl rounded-tr-xs bg-blue-600 text-white text-sm leading-relaxed shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Attached files badge */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-blue-500/40 space-y-1">
                          {msg.files.map((file, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-1.5 text-[11px] bg-blue-700/60 px-2 py-1 rounded-lg"
                            >
                              <FileText className="w-3 h-3" />
                              <span className="truncate">{file.filename}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Council Response Message */
                    <div className="w-full space-y-3">
                      {/* Thinking & Progress Indicator */}
                      {msg.isThinking && msg.progress && (
                        <div className="p-4 rounded-2xl bg-[#121214] border border-[#27272a] space-y-3 shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            <span className="text-xs font-semibold text-white">
                              AI Council is deliberating...
                            </span>
                            <span className="text-[11px] text-[#71717a] ml-auto">
                              {msg.progress.stage}
                            </span>
                          </div>

                          {/* Providers parallel status */}
                          <div className="pt-2 border-t border-[#27272a] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {[
                              { id: 'gemini', name: 'Google Gemini' },
                              { id: 'openai', name: 'OpenAI GPT' },
                              { id: 'anthropic', name: 'Anthropic Claude' },
                              { id: 'mistral', name: 'Mistral AI' },
                            ].map((p) => {
                              const status = msg.progress?.providerStatuses[p.id] || 'thinking';
                              const isComplete = status === 'completed';
                              return (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[#18181b] border border-[#27272a]"
                                >
                                  {isComplete ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                                  )}
                                  <span className="text-[11px] font-medium text-[#fafafa] truncate">
                                    {p.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Deliberation steps */}
                          <div className="flex items-center justify-between text-[11px] text-[#71717a] px-1 pt-1">
                            <span className="flex items-center gap-1">
                              Analyzer:{' '}
                              <span
                                className={
                                  msg.progress.stageStatuses.analyzer === 'completed'
                                    ? 'text-green-400 font-semibold'
                                    : 'text-blue-400'
                                }
                              >
                                {msg.progress.stageStatuses.analyzer === 'completed' ? '✓ Done' : 'Running...'}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              Critic:{' '}
                              <span
                                className={
                                  msg.progress.stageStatuses.critic === 'completed'
                                    ? 'text-green-400 font-semibold'
                                    : msg.progress.stageStatuses.critic === 'thinking'
                                    ? 'text-blue-400'
                                    : 'Pending'
                                }
                              >
                                {msg.progress.stageStatuses.critic === 'completed'
                                  ? '✓ Done'
                                  : msg.progress.stageStatuses.critic === 'thinking'
                                  ? 'Reviewing...'
                                  : 'Queued'}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              Judge:{' '}
                              <span
                                className={
                                  msg.progress.stageStatuses.judge === 'completed'
                                    ? 'text-green-400 font-semibold'
                                    : msg.progress.stageStatuses.judge === 'thinking'
                                    ? 'text-blue-400'
                                    : 'Pending'
                                }
                              >
                                {msg.progress.stageStatuses.judge === 'completed'
                                  ? '✓ Done'
                                  : msg.progress.stageStatuses.judge === 'thinking'
                                  ? 'Synthesizing...'
                                  : 'Queued'}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Completed Final Answer Bubble */}
                      {!msg.isThinking && msg.content && (
                        <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-[#121214] border border-[#27272a] text-[#fafafa] space-y-3 shadow-xs">
                          {/* Header metadata tag */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-[#27272a] text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">AI Council</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                Synthesized Consensus
                              </span>
                              {analysis?.confidence && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                                  {analysis.confidence}% Confidence
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#71717a]">{msg.timestamp}</span>
                          </div>

                          {/* Rendered Markdown Body */}
                          <div className="text-sm leading-relaxed text-[#fafafa]">
                            <MarkdownView content={msg.content} />
                          </div>

                          {/* Quick Action Toolbar */}
                          <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs text-[#71717a]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyAnswer(msg.content, msg.id)}
                                className="flex items-center gap-1.5 hover:text-white px-2 py-1 rounded-lg hover:bg-[#18181b] transition-colors cursor-pointer"
                                title="Copy answer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                    <span className="text-green-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleSendQuestion(messages[messages.indexOf(msg) - 1]?.content)}
                                className="flex items-center gap-1.5 hover:text-white px-2 py-1 rounded-lg hover:bg-[#18181b] transition-colors cursor-pointer"
                                title="Regenerate synthesis"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Regenerate</span>
                              </button>

                              {onOpenMap && (
                                <button
                                  onClick={() => onOpenMap(msg.content.slice(0, 80))}
                                  className="flex items-center gap-1.5 hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-[#18181b] transition-colors cursor-pointer"
                                  title="View spatial context in Google Maps"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Map</span>
                                </button>
                              )}
                            </div>

                            {/* Expand Council Analysis Toggle */}
                            {analysis && (
                              <button
                                onClick={() =>
                                  setExpandedAnalysisId(isExpanded ? null : msg.id)
                                }
                                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded-lg hover:bg-blue-600/10 transition-colors cursor-pointer"
                              >
                                <span>
                                  {isExpanded
                                    ? 'Hide Council Analysis'
                                    : `View Council Analysis (${analysis.responses?.length || 4} AIs)`}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expandable Deep Council Analysis Accordion */}
                      {analysis && isExpanded && (
                        <div className="p-4 rounded-2xl bg-[#0e0e11] border border-[#27272a] space-y-4 shadow-sm animate-in fade-in duration-200">
                          {/* Tabs */}
                          <div className="flex items-center gap-1 border-b border-[#27272a] pb-2 text-xs overflow-x-auto">
                            <button
                              onClick={() =>
                                setAnalysisActiveTab((prev) => ({ ...prev, [msg.id]: 'providers' }))
                              }
                              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                                activeTab === 'providers'
                                  ? 'bg-blue-600 text-white'
                                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                              }`}
                            >
                              Provider Responses ({analysis.responses?.length || 4})
                            </button>
                            <button
                              onClick={() =>
                                setAnalysisActiveTab((prev) => ({ ...prev, [msg.id]: 'cross' }))
                              }
                              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                                activeTab === 'cross'
                                  ? 'bg-blue-600 text-white'
                                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                              }`}
                            >
                              Cross-Analyzer
                            </button>
                            <button
                              onClick={() =>
                                setAnalysisActiveTab((prev) => ({ ...prev, [msg.id]: 'critic' }))
                              }
                              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                                activeTab === 'critic'
                                  ? 'bg-blue-600 text-white'
                                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                              }`}
                            >
                              Adversarial Critic
                            </button>
                            <button
                              onClick={() =>
                                setAnalysisActiveTab((prev) => ({ ...prev, [msg.id]: 'judge' }))
                              }
                              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                                activeTab === 'judge'
                                  ? 'bg-blue-600 text-white'
                                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                              }`}
                            >
                              Judge Reasoning
                            </button>
                          </div>

                          {/* Tab 1: All 4 Provider Responses */}
                          {activeTab === 'providers' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {analysis.responses?.map((resp: ProviderResponse, rIdx: number) => {
                                const isSuccess = resp.status === 'success';
                                return (
                                  <div
                                    key={rIdx}
                                    className="p-3.5 rounded-xl bg-[#141417] border border-[#27272a] space-y-2 flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-xs text-white">
                                          {resp.providerName}
                                        </span>
                                        <span
                                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                            isSuccess
                                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                          }`}
                                        >
                                          {isSuccess ? `${resp.responseTime}ms` : 'Error / Unconfigured'}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-[#71717a] block mb-2">
                                        {resp.model}
                                      </span>

                                      {isSuccess ? (
                                        <div className="text-xs text-[#a1a1aa] max-h-48 overflow-y-auto leading-relaxed pr-1">
                                          <MarkdownView content={resp.answer} />
                                        </div>
                                      ) : (
                                        <p className="text-xs text-red-400/80 italic">
                                          {resp.error || 'Provider did not respond.'}
                                        </p>
                                      )}
                                    </div>

                                    {resp.keyClaims && resp.keyClaims.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-[#27272a] text-[11px] space-y-1">
                                        <span className="text-[#71717a] font-medium block">
                                          Key Claims:
                                        </span>
                                        {resp.keyClaims.slice(0, 2).map((claim, cIdx) => (
                                          <p key={cIdx} className="text-[#a1a1aa] truncate">
                                            • {claim}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Tab 2: Cross-Analysis */}
                          {activeTab === 'cross' && (
                            <div className="space-y-3 text-xs">
                              {analysis.analysis?.consensus && analysis.analysis.consensus.length > 0 && (
                                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 space-y-1">
                                  <span className="font-semibold text-green-400">
                                    Agreements & Consensus:
                                  </span>
                                  {analysis.analysis.consensus.map((c, i) => (
                                    <p key={i} className="text-[#a1a1aa] leading-relaxed">
                                      • {c}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {analysis.analysis?.disagreements && analysis.analysis.disagreements.length > 0 && (
                                <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-1">
                                  <span className="font-semibold text-yellow-400">
                                    Divergences & Conflicts:
                                  </span>
                                  {analysis.analysis.disagreements.map((d, i) => (
                                    <p key={i} className="text-[#a1a1aa] leading-relaxed">
                                      • {d}
                                    </p>
                                  ))}
                                </div>
                              )}

                              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] space-y-1">
                                <span className="font-semibold text-white">Comparative Quality Assessment:</span>
                                <p className="text-[#a1a1aa] leading-relaxed">
                                  {analysis.analysis?.reasoningAssessment ||
                                    'Comprehensive multi-model comparative analysis completed.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Critic Review */}
                          {activeTab === 'critic' && (
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141417] border border-[#27272a]">
                                <span className="text-[#71717a]">Reliability Verdict</span>
                                <span
                                  className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-[11px] ${
                                    analysis.critic?.reliabilityVerdict === 'reliable'
                                      ? 'bg-green-500/10 text-green-400'
                                      : analysis.critic?.reliabilityVerdict === 'partially_reliable'
                                      ? 'bg-yellow-500/10 text-yellow-400'
                                      : 'bg-red-500/10 text-red-400'
                                  }`}
                                >
                                  {analysis.critic?.reliabilityVerdict || 'reliable'}
                                </span>
                              </div>

                              {analysis.critic?.criticalErrors && analysis.critic.criticalErrors.length > 0 && (
                                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1">
                                  <span className="font-semibold text-red-400">
                                    Flagged Critical Issues:
                                  </span>
                                  {analysis.critic.criticalErrors.map((err, i) => (
                                    <p key={i} className="text-[#a1a1aa]">
                                      • {err}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {analysis.critic?.weakReasoning && analysis.critic.weakReasoning.length > 0 && (
                                <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] space-y-1">
                                  <span className="font-semibold text-yellow-400">
                                    Weak Reasoning / Assumptions:
                                  </span>
                                  {analysis.critic.weakReasoning.map((w, i) => (
                                    <p key={i} className="text-[#a1a1aa]">
                                      • {w}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tab 4: Supreme Judge Reasoning */}
                          {activeTab === 'judge' && (
                            <div className="space-y-3 text-xs">
                              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] space-y-1.5">
                                <span className="font-semibold text-white">Judge Synthesis Rationale:</span>
                                <p className="text-[#a1a1aa] leading-relaxed">
                                  {analysis.decision?.decisionSummary ||
                                    'Balanced all competing arguments to construct the single most authoritative answer.'}
                                </p>
                              </div>

                              {analysis.decision?.uncertainty && analysis.decision.uncertainty.length > 0 && (
                                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                                  <span className="font-semibold text-blue-400">
                                    Recognized Uncertainties / Boundaries:
                                  </span>
                                  {analysis.decision.uncertainty.map((u, i) => (
                                    <p key={i} className="text-[#a1a1aa]">
                                      • {u}
                                    </p>
                                  ))}
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
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Message Input Area */}
      <div className="sticky bottom-0 z-20 bg-[#09090b]/95 backdrop-blur-md pt-2 pb-4 px-3 sm:px-4 border-t border-[#27272a]/50">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* File attachments pill badge preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] py-1 px-2.5 rounded-full"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[150px]">{file.filename}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="hover:text-red-400 text-[#71717a] transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Rounded Input Container */}
          <div className="relative rounded-2xl bg-[#141417] border border-[#27272a] focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all p-2.5 shadow-md">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Council... (Enter to send, Shift+Enter for new line)"
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-[#fafafa] placeholder:text-[#52525b] resize-none focus:outline-hidden max-h-48 leading-relaxed px-1 py-1"
            />

            {/* Input Footer Controls */}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#27272a]/60">
              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.txt,.md,.json,.js,.ts,.py,.java,.csv"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isLoading}
                  className="p-1.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#1e1e22] transition-colors cursor-pointer"
                  title="Attach document or code file"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>

                {/* Mode Selector Pill */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg bg-[#1e1e22] text-[#a1a1aa] hover:text-white border border-[#27272a] transition-colors cursor-pointer"
                  >
                    <span>{selectedMode}</span>
                    <ChevronDown className="w-3 h-3 text-[#71717a]" />
                  </button>

                  {/* Mode Dropdown Menu */}
                  <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block w-48 p-1 rounded-xl bg-[#18181b] border border-[#27272a] shadow-xl z-30 space-y-0.5">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMode(m.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                          selectedMode === m.id
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                        }`}
                      >
                        <span>{m.label}</span>
                        {selectedMode === m.id && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spatial / Map Grounding Quick Button */}
                {onOpenMap && (
                  <button
                    onClick={() => onOpenMap(inputQuestion)}
                    className="flex items-center gap-1 text-xs text-[#71717a] hover:text-blue-400 py-1 px-2 rounded-lg hover:bg-[#1e1e22] transition-colors cursor-pointer"
                    title="Explore location on Google Maps"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSendQuestion()}
                disabled={!inputQuestion.trim() || isLoading}
                className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inputQuestion.trim() && !isLoading
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-sm'
                    : 'bg-[#27272a] text-[#71717a] cursor-not-allowed opacity-50'
                }`}
                title="Send message to AI Council"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-[#52525b]">
            AI Council synthesizes cross-model reasoning across 4 frontier models. Verify critical output.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Cpu,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Sliders,
  Moon,
  Sun,
  Database,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CouncilMode, AIProviderMeta, HealthResponse } from '../../types/ai';

interface SettingsViewProps {
  providers: AIProviderMeta[];
  defaultMode: CouncilMode;
  setDefaultMode: (mode: CouncilMode) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  health: HealthResponse | null;
}

const MODES: CouncilMode[] = ['QUICK', 'BALANCED', 'DEEP ANALYSIS', 'DEBATE', 'CODING'];

export const SettingsView: React.FC<SettingsViewProps> = ({
  providers,
  defaultMode,
  setDefaultMode,
  demoMode,
  setDemoMode,
  health,
}) => {
  return (
    <div id="settings-view-container" className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
          Configure provider routing, default synthesis protocols, and infrastructure preferences.
        </p>
      </div>

      {/* AI Providers Section */}
      <section className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
              AI Providers Status
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            <span>Server-side Key Protection</span>
          </div>
        </div>
        <p className="text-xs text-[#a1a1aa]">
          The Council dynamically mounts models based on server-side environment credentials. For security, API keys are never exposed to the client interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {providers.map((p) => {
            const isConfigured = p.configured;

            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-[#fafafa]">{p.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${
                        isConfigured
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-[#18181b] text-[#71717a] border border-[#27272a]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-green-400' : 'bg-[#71717a]'}`} />
                      {isConfigured ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#71717a] block mb-2">{p.modelName}</span>
                  <p className="text-xs text-[#a1a1aa]">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Default Mode Preference */}
      <section className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
            Default Analysis Mode
          </h2>
        </div>
        <p className="text-xs text-[#a1a1aa]">
          Select the initial deliberation pipeline archetype for new questions.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {MODES.map((m) => {
            const isSelected = defaultMode === m;
            return (
              <button
                key={m}
                onClick={() => setDefaultMode(m)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#09090b] text-[#a1a1aa] border-[#27272a] hover:text-white'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </section>

      {/* Demo Mode Toggle */}
      <section className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
                Demo Council Simulation Mode
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Simulates distinct specialized perspectives to test multi-model consensus and synthesis without consuming model quotas.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#27272a] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {demoMode && (
          <p className="text-xs text-purple-300 bg-purple-950/40 p-3 rounded-xl border border-purple-800/50">
            Demo Mode active. All generated responses will be explicitly tagged with &quot;Simulation&quot;.
          </p>
        )}
      </section>

      {/* Database & Storage Status */}
      <section className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-green-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
            Persistence & Infrastructure
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-1">
            <span className="text-[#71717a]">Database Engine</span>
            <div className="flex items-center justify-between font-semibold text-[#fafafa]">
              <span>MongoDB Atlas (`ai_council`)</span>
              <span className={health?.mongodb ? 'text-green-500' : 'text-yellow-500'}>
                {health?.mongodb ? 'Connected' : 'Local Fallback'}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-1">
            <span className="text-[#71717a]">File Storage</span>
            <div className="flex items-center justify-between font-semibold text-[#fafafa]">
              <span>Vercel Blob / Buffer</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

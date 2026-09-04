import React from 'react';
import {
  FileText,
  Cpu,
  Inbox,
  GitCompare,
  ShieldAlert,
  Scale,
  Award,
  Database,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface ProgressStageProps {
  currentStage: number; // 1 to 9
  stageText: string;
}

const STAGES = [
  { step: 1, title: 'Preparing question', icon: FileText },
  { step: 2, title: 'Consulting AI providers', icon: Cpu },
  { step: 3, title: 'Collecting responses', icon: Inbox },
  { step: 4, title: 'Comparing answers', icon: GitCompare },
  { step: 5, title: 'Running critical analysis', icon: ShieldAlert },
  { step: 6, title: 'Evaluating disagreements', icon: Scale },
  { step: 7, title: 'Final judge', icon: Award },
  { step: 8, title: 'Saving analysis', icon: Database },
];

export const ProgressStage: React.FC<ProgressStageProps> = ({ currentStage, stageText }) => {
  return (
    <div
      id="live-analysis-progress-card"
      className="w-full max-w-4xl mx-auto my-6 p-6 rounded-2xl bg-[#18181b] border border-[#27272a] shadow-xs"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Council Deliberation In Progress
            </h3>
            <p className="text-xs text-[#a1a1aa] font-medium mt-0.5">
              {stageText || 'Convening independent AI reasoning engines...'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#a1a1aa]">
            Stage {Math.min(currentStage, 8)} of 8
          </span>
          <div className="text-[10px] text-[#71717a]">
            {Math.round((Math.min(currentStage, 8) / 8) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${(Math.min(currentStage, 8) / 8) * 100}%` }}
        />
      </div>

      {/* Grid of pipeline steps in Bento styling */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const isDone = currentStage > s.step;
          const isCurrent = currentStage === s.step;

          return (
            <div
              key={s.step}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                isDone
                  ? 'bg-[#09090b] border-[#27272a] text-green-400'
                  : isCurrent
                  ? 'bg-[#09090b] border-blue-500/80 text-white ring-1 ring-blue-500/40'
                  : 'bg-[#09090b]/40 border-[#27272a]/40 text-[#71717a]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isDone
                    ? 'bg-green-500/10 text-green-400'
                    : isCurrent
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-[#18181b] text-[#71717a]'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate">{s.title}</p>
                <p className="text-[10px] text-[#71717a]">Step {s.step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

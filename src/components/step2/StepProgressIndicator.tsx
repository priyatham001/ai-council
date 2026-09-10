import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface StepProgressIndicatorProps {
  currentSubStep: 1 | 2 | 3;
  onJumpToStep?: (step: 1 | 2 | 3) => void;
  isStep1Complete: boolean;
  isStep2Complete: boolean;
}

export const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  currentSubStep,
  onJumpToStep,
  isStep1Complete,
  isStep2Complete,
}) => {
  const steps = [
    {
      num: 1 as const,
      label: 'Crop Selection',
      sublabel: 'What crop & quantity',
      isComplete: isStep1Complete,
    },
    {
      num: 2 as const,
      label: 'Quality & Photo',
      sublabel: 'Grade estimate & photo',
      isComplete: isStep2Complete,
    },
    {
      num: 3 as const,
      label: 'AI Verification',
      sublabel: 'Explainable AI analysis',
      isComplete: false,
    },
  ];

  return (
    <div id="crop-flow-progress-bar" className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting line behind steps */}
        <div className="absolute left-6 right-6 top-5 h-0.5 bg-stone-200 -z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{
              width: currentSubStep === 1 ? '0%' : currentSubStep === 2 ? '50%' : '100%',
            }}
          />
        </div>

        {steps.map((step) => {
          const isActive = currentSubStep === step.num;
          const isDone = step.isComplete && currentSubStep > step.num;
          const canClick = step.num < currentSubStep || (step.num === 2 && isStep1Complete);

          return (
            <button
              key={step.num}
              type="button"
              disabled={!canClick && !isActive}
              onClick={() => onJumpToStep && canClick && onJumpToStep(step.num)}
              className={`relative z-10 flex flex-col items-center text-center transition-all ${
                canClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                    : isActive
                    ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100 scale-105'
                    : 'bg-stone-100 text-stone-500 border border-stone-300'
                }`}
              >
                {isDone ? (
                  <Check className="w-5 h-5 text-white stroke-[2.5]" />
                ) : step.num === 3 ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  step.num
                )}
              </div>

              <div className="mt-2">
                <div
                  className={`text-xs sm:text-sm font-bold leading-tight ${
                    isActive ? 'text-emerald-900 font-extrabold' : isDone ? 'text-stone-800' : 'text-stone-500'
                  }`}
                >
                  Step {step.num}: {step.label}
                </div>
                <div className="hidden sm:block text-[11px] text-stone-500 mt-0.5 font-medium">
                  {step.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

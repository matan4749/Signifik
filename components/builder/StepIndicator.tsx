'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { TOTAL_STEPS } from '@/hooks/useBuilderState';
import { useLang } from '@/lib/i18n/context';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const { t } = useLang();

  const stepLabels = [
    t.wizard_step_business,
    t.wizard_step_design,
    t.wizard_step_content,
    t.wizard_step_media,
    t.wizard_step_domain,
    t.wizard_step_review,
  ];

  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const step = i + 1;
        const isCompleted = currentStep > step;
        const isCurrent = currentStep === step;
        const isClickable = onStepClick && isCompleted;

        return (
          <div key={step} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-1.5 group',
                isClickable ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold',
                  'transition-all duration-200 border',
                  isCompleted && 'bg-indigo-500 border-indigo-500 text-white',
                  isCurrent && 'bg-indigo-500/20 border-indigo-500 text-indigo-400',
                  !isCompleted && !isCurrent && 'bg-white/5 border-white/15 text-white/30'
                )}
              >
                {isCompleted ? <Check size={14} /> : step}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isCurrent ? 'text-indigo-400' : isCompleted ? 'text-white/60' : 'text-white/25'
                )}
              >
                {stepLabels[i]}
              </span>
            </button>

            {step < TOTAL_STEPS && (
              <div
                className={cn(
                  'h-px w-8 sm:w-12 mx-1 transition-all duration-200',
                  isCompleted ? 'bg-indigo-500' : 'bg-white/10'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

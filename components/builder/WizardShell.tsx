'use client';

import { useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepIndicator } from './StepIndicator';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { TOTAL_STEPS } from '@/hooks/useBuilderState';
import { springGentle } from '@/lib/utils/motion';
import { useLang } from '@/lib/i18n/context';
import { SignifikLogo } from '@/components/ui/SignifikLogo';

interface WizardShellProps {
  currentStep: number;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  children: ReactNode;
}

export function WizardShell({ currentStep, onBack, onGoToStep, children }: WizardShellProps) {
  const { t } = useLang();
  const prevStepRef = useRef(currentStep);
  const direction = currentStep >= prevStepRef.current ? 1 : -1;
  prevStepRef.current = currentStep;

  const variants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0, transition: springGentle },
    exit:   (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -48 : 48,
      transition: { ...springGentle, stiffness: 260 },
    }),
  };

  return (
    <div className="min-h-screen liquid-bg flex flex-col">
      <header
        className="sticky top-0 z-20 border-b border-white/8"
        style={{
          background: 'rgba(3,7,18,0.7)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="w-36">
            {currentStep > 1 && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  icon={<ChevronLeft size={16} />}
                >
                  {t.wizard_back}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Center: logo when step 1, step indicator otherwise */}
          {currentStep === 1 ? (
            <SignifikLogo height={22} />
          ) : (
            <StepIndicator currentStep={currentStep} onStepClick={onGoToStep} />
          )}

          <div className="w-36 text-right">
            <span className="text-xs text-white/25 tabular-nums">
              {currentStep} / {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12 overflow-hidden">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

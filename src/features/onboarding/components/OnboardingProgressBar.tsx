import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

import { TOTAL_STEPS } from '../constants/onboardingConfig';

// ============================================================================
// Types
// ============================================================================

interface OnboardingProgressBarProps {
  /** Progresso de 0 a 1 */
  readonly progress: number;
}

// ============================================================================
// Helpers
// ============================================================================

const getSegmentColor = (isCompleted: boolean, isCurrent: boolean): string => {
  if (isCompleted) return '#19d05f';
  if (isCurrent) return '#228e4c';
  return '#363636';
};

// ============================================================================
// Component
// ============================================================================

/**
 * Barra de progresso segmentada para o onboarding.
 * Cada segmento representa um step — preenchido em verde quando completado.
 */
export default function OnboardingProgressBar({ progress }: OnboardingProgressBarProps) {
  const completedSteps = Math.round(progress * TOTAL_STEPS);

  return (
    <div className="flex w-full max-w-[500px] items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
        const isCompleted = index < completedSteps;
        const isCurrent = index === completedSteps;

        return (
          <motion.div
            animate={{
              backgroundColor: getSegmentColor(isCompleted, isCurrent),
            }}
            className={cn('h-1.5 flex-1 rounded-full')}
            key={index}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

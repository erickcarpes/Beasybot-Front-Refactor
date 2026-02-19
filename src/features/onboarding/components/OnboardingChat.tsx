import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { TypingIndicator } from '@/features/chat';

import { useOnboarding } from '../hooks/useOnboarding';
import OnboardingInput from './OnboardingInput';
import OnboardingMessage from './OnboardingMessage';
import OnboardingOptions from './OnboardingOptions';
import OnboardingProgressBar from './OnboardingProgressBar';
import OnboardingReview from './OnboardingReview';
import OnboardingSkipButton from './OnboardingSkipButton';

// ============================================================================
// Component
// ============================================================================

/**
 * Container principal do onboarding — composição de todos os sub-componentes.
 * Layout chat-style com scroll automático, progress bar e skip button.
 */
export default function OnboardingChat() {
  const {
    currentStep,
    currentStepId,
    handleFinish,
    handleInputSubmit,
    handleOptionSelect,
    handleReviewConfirm,
    handleSkip,
    isLastStep,
    isSubmitting,
    isTyping,
    messages,
    progress,
  } = useOnboarding();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ao adicionar mensagens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        behavior: 'smooth',
        top: scrollRef.current.scrollHeight,
      });
    }
  }, [messages, isTyping]);

  // ── Render interaction area (options, input, review) ─────────────────────
  const renderInteraction = () => {
    if (isTyping) return null;

    if (currentStep.type === 'options') {
      return (
        <OnboardingOptions
          disabled={isSubmitting}
          onSelect={(value) => {
            if (isLastStep) {
              void handleFinish(value);
            } else {
              handleOptionSelect(value);
            }
          }}
          options={currentStep.options ?? []}
        />
      );
    }

    if (currentStep.type === 'input') {
      return (
        <OnboardingInput
          disabled={isSubmitting}
          onSubmit={handleInputSubmit}
          placeholder={currentStep.placeholder}
        />
      );
    }

    return <OnboardingReview onConfirm={handleReviewConfirm} />;
  };

  return (
    <div className="bg-background relative flex h-screen w-screen flex-col items-center">
      {/* ─── Skip Button (top right) ─── */}
      <div className="absolute top-6 right-6 z-10">
        <OnboardingSkipButton
          disabled={isSubmitting}
          onSkip={() => {
            void handleSkip();
          }}
        />
      </div>

      {/* ─── Chat Area ─── */}
      <div
        className="scrollbar-thin flex w-full max-w-[750px] flex-1 flex-col gap-10 overflow-y-auto px-4 pt-20 pb-8 md:px-8"
        ref={scrollRef}
      >
        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <OnboardingMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
          >
            <div className="w-8">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        {/* Interaction area */}
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={currentStepId}
          >
            {renderInteraction()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Progress Bar (bottom) ─── */}
      <div className="flex w-full justify-center px-8 pt-4 pb-8">
        <OnboardingProgressBar progress={progress} />
      </div>
    </div>
  );
}

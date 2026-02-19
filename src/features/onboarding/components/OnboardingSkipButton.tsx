import { motion } from 'framer-motion';

// ============================================================================
// Types
// ============================================================================

interface OnboardingSkipButtonProps {
  /** Se o botão está desabilitado (ex: durante submit) */
  readonly disabled?: boolean;
  /** Callback ao clicar em pular */
  readonly onSkip: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Botão "Prefiro deixar para depois" fixo no canto superior direito.
 * Permite que o usuário pule o onboarding.
 */
export default function OnboardingSkipButton({
  disabled = false,
  onSkip,
}: OnboardingSkipButtonProps) {
  return (
    <motion.button
      animate={{ opacity: 1 }}
      className="text-body-s text-text-gray hover:text-text-white cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      initial={{ opacity: 0 }}
      onClick={onSkip}
      transition={{ delay: 0.5, duration: 0.4 }}
      type="button"
    >
      Prefiro deixar para depois
    </motion.button>
  );
}

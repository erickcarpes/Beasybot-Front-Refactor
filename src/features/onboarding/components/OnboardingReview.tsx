import { motion } from 'framer-motion';

import Button from '@/components/ui/Button';

// ============================================================================
// Types
// ============================================================================

interface OnboardingReviewProps {
  /** Se está em estado de carregamento */
  readonly isLoading?: boolean;
  /** Callback ao confirmar */
  readonly onConfirm: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Step de review (step7) — exibe que a descrição da empresa está sendo gerada
 * e permite confirmar para avançar.
 *
 * Futuramente, integrará com o N8N para exibir a descrição gerada.
 */
export default function OnboardingReview({ isLoading = false, onConfirm }: OnboardingReviewProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="border-brand h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-body-s text-text-gray">Gerando descrição...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Placeholder para descrição gerada — N8N retornará o conteúdo */}
          <div className="border-border-dark-gray bg-component-default w-full max-w-[500px] rounded-xl border p-4">
            <p className="text-body-s text-text-gray italic">
              A descrição da sua empresa será gerada aqui com base nas informações fornecidas.
            </p>
          </div>

          <Button onClick={onConfirm} size="medium" type="button" variant="primary">
            Continuar
          </Button>
        </div>
      )}
    </motion.div>
  );
}

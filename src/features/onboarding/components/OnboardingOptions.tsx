import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

import type { Option } from '../types';

// ============================================================================
// Types
// ============================================================================

interface OnboardingOptionsProps {
  /** Se as opções estão desabilitadas (ex: durante typing ou submit) */
  readonly disabled?: boolean;
  /** Callback ao selecionar uma opção */
  readonly onSelect: (value: string) => void;
  /** Lista de opções */
  readonly options: readonly Option[];
}

// ============================================================================
// Animation
// ============================================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Component
// ============================================================================

/**
 * Grid de botões de opção para steps do tipo 'options'.
 * Animação staggered de entrada para cada opção.
 */
export default function OnboardingOptions({
  disabled = false,
  onSelect,
  options,
}: OnboardingOptionsProps) {
  return (
    <motion.div
      animate="visible"
      className="flex flex-wrap justify-center gap-3"
      initial="hidden"
      variants={containerVariants}
    >
      {options.map((option) => (
        <motion.button
          className={cn(
            'border-border-gray text-body-s text-text-white rounded-xl border px-5 py-3 transition-all duration-200',
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-brand hover:text-brand cursor-pointer hover:shadow-[0_0_12px_rgba(25,208,95,0.15)]',
          )}
          disabled={disabled}
          key={option.value}
          onClick={() => {
            onSelect(option.value);
          }}
          type="button"
          variants={itemVariants}
          whileHover={disabled ? {} : { scale: 1.03 }}
          whileTap={disabled ? {} : { scale: 0.97 }}
        >
          {option.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

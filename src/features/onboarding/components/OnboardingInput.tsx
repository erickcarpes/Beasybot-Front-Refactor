import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { type KeyboardEvent, useCallback, useState } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// Types
// ============================================================================

interface OnboardingInputProps {
  /** Se o input está desabilitado */
  readonly disabled?: boolean;
  /** Callback ao enviar o texto */
  readonly onSubmit: (value: string) => void;
  /** Placeholder do input */
  readonly placeholder?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Input de texto para steps do tipo 'input'.
 * Estilizado como uma bolha de chat do usuário com botão de envio.
 */
export default function OnboardingInput({
  disabled = false,
  onSubmit,
  placeholder = 'Digite aqui...',
}: OnboardingInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  }, [value, disabled, onSubmit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full justify-end"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-component-default flex w-full max-w-[400px] items-end gap-2 rounded-2xl rounded-tr-sm px-4 py-3">
        <textarea
          autoFocus={true}
          className={cn(
            'text-body-m text-text-white placeholder:text-text-gray flex-1 resize-none bg-transparent outline-none',
            'max-h-24 min-h-[24px]',
          )}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          value={value}
        />
        <button
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg p-1.5 transition-colors',
            value.trim()
              ? 'text-brand cursor-pointer hover:bg-white/5'
              : 'cursor-not-allowed text-gray-600',
          )}
          disabled={!value.trim() || disabled}
          onClick={handleSubmit}
          type="button"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
}

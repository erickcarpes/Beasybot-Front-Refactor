import { motion } from 'framer-motion';

import arrowLogo from '@/assets/arrow-logo.svg';
import { cn } from '@/utils/cn';

import type { ChatMessage } from '../types';

// ============================================================================
// Types
// ============================================================================

interface OnboardingMessageProps {
  readonly message: ChatMessage;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Bubble de mensagem do onboarding.
 * Bot: ícone >> + texto à esquerda.
 * User: texto à direita com background.
 */
export default function OnboardingMessage({ message }: OnboardingMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex w-full', isBot ? 'justify-start' : 'justify-end')}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {isBot ? (
        <div className="flex max-w-[85%] items-start gap-3">
          <img alt="Beasybot" className="mt-1 h-5 w-5 shrink-0" src={arrowLogo} />
          <p className="text-body-m text-text-white leading-relaxed">{message.content}</p>
        </div>
      ) : (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="bg-component-default max-w-[70%] rounded-2xl rounded-tr-sm px-5 py-3"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-body-m text-text-white">{message.content}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

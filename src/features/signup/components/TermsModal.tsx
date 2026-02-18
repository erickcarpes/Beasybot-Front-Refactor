import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/utils/cn';

import { TERMS_FOOTER, TERMS_LAST_UPDATED, TERMS_SECTIONS } from '../constants/termsContent';

interface TermsModalProps {
  readonly isOpen: boolean;
  readonly onAccept: () => void;
  readonly onClose: () => void;
}

export default function TermsModal({ isOpen, onAccept, onClose }: TermsModalProps) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  // Reset scroll state when modal opens (using ref to avoid lint warning)
  useEffect(() => {
    if (
      isOpen &&
      !wasOpenRef.current && // Modal just opened - reset scroll position
      contentRef.current
    ) {
      contentRef.current.scrollTop = 0;
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Reset hasScrolledToEnd when modal closes
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const { clientHeight, scrollHeight, scrollTop } = contentRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isAtBottom && !hasScrolledToEnd) {
      setHasScrolledToEnd(true);
    }
  }, [hasScrolledToEnd]);

  const handleAccept = useCallback(() => {
    onAccept();
    onClose();
    setHasScrolledToEnd(false);
  }, [onAccept, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    setHasScrolledToEnd(false);
  }, [onClose]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-labelledby="terms-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Modal.Root className="max-h-[85vh] w-full max-w-2xl overflow-hidden" disabledBackdrop>
              <Modal.Title id="terms-modal-title" onClose={handleClose} visible>
                Termos de Uso e Política de Privacidade
              </Modal.Title>

              <div
                className="text-text-muted scrollbar-thin mb-m -mx-4 max-h-[50vh] overflow-y-auto px-4 text-sm leading-relaxed"
                onScroll={handleScroll}
                ref={contentRef}
              >
                <p className="text-text-muted mb-6 text-xs">
                  <strong>Última atualização:</strong> {TERMS_LAST_UPDATED}
                </p>

                {TERMS_SECTIONS.map((section) => (
                  <section key={section.title}>
                    <h3 className="text-text-white mt-6 mb-2 text-base font-semibold">
                      {section.title}
                    </h3>
                    {section.content}
                  </section>
                ))}

                {TERMS_FOOTER}
              </div>

              <div className="flex h-8 items-center justify-center">
                <AnimatePresence mode="wait">
                  {!hasScrolledToEnd && (
                    <motion.p
                      animate={{ opacity: 1 }}
                      className="text-text-muted text-center text-xs"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key="scroll-hint"
                      transition={{ duration: 0.15 }}
                    >
                      Role até o final para aceitar os termos
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Modal.Actions>
                <Button onClick={handleClose} size="full" variant="neutral">
                  Cancelar
                </Button>
                <Button
                  className={cn(
                    'transition-opacity',
                    !hasScrolledToEnd && 'cursor-not-allowed opacity-50',
                  )}
                  disabled={!hasScrolledToEnd}
                  onClick={handleAccept}
                  size="full"
                  variant="primary"
                >
                  Aceitar Termos
                </Button>
              </Modal.Actions>
            </Modal.Root>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

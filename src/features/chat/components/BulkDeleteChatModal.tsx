import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface BulkDeleteChatModalProps {
  readonly ids: string[];
  readonly isOpen: boolean;
  readonly isPending: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

/**
 * Modal for confirming bulk deletion of chats.
 * Pure presentational component that delegates logic to the parent.
 */
export default function BulkDeleteChatModal({
  ids,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: BulkDeleteChatModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Modal.Root>
              <Modal.Title onClose={onClose} visible>
                Excluir conversas
              </Modal.Title>

              <Modal.Description>
                Tem certeza que deseja excluir <strong>{ids.length}</strong> conversas selecionadas?
                Esta ação não pode ser desfeita.
              </Modal.Description>

              <Modal.Actions className="flex justify-end gap-3 pt-6">
                <Button
                  disabled={isPending}
                  onClick={onClose}
                  size="medium"
                  type="button"
                  variant="neutral"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isPending}
                  onClick={onConfirm}
                  size="medium"
                  type="button"
                  variant="destructive"
                >
                  {isPending ? 'Excluindo...' : 'Excluir'}
                </Button>
              </Modal.Actions>
            </Modal.Root>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

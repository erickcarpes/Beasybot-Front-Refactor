import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal/Index';

interface BulkDeleteFilesModalProps {
  readonly ids: string[];
  readonly isOpen: boolean;
  readonly isPending: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

/**
 * Modal for confirming bulk deletion of files.
 * Pure presentational component that delegates logic to the parent.
 */
export default function BulkDeleteFilesModal({
  ids,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: BulkDeleteFilesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Modal.Root>
              <Modal.Title onClose={onClose} visible>
                Excluir arquivos
              </Modal.Title>

              <Modal.Description>
                Tem certeza que deseja excluir <strong>{ids.length}</strong> arquivos selecionados?
                Esta ação não pode ser desfeita.
              </Modal.Description>

              <Modal.Actions className="flex justify-center gap-3 pt-6">
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

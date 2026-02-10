import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal/Index';
import { useDeleteChats } from '@/features/chat';

interface BulkDeleteChatModalProps {
  readonly ids: string[];
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export default function BulkDeleteChatModal({
  ids,
  isOpen,
  onClose,
  onSuccess,
}: BulkDeleteChatModalProps) {
  const { isPending, mutate: deleteChats } = useDeleteChats();

  const handleDelete = () => {
    if (ids.length === 0) return;

    deleteChats(ids, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

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
                  onClick={handleDelete}
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

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/user/userContext';
import { useDeleteUser } from '@/services/beasybox-api/user';

interface DeleteAccountModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const { isPending, mutateAsync: deleteUser } = useDeleteUser();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const handleConfirm = async () => {
    if (!password) {
      showToast('A senha é obrigatória', 'error');
      return;
    }

    try {
      await deleteUser({ password });
      showToast('Conta deletada com sucesso', 'success');
      onClose();
      await logout();
    } catch {
      showToast('Erro ao deletar conta. Verifique sua senha e tente novamente.', 'error');
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setPassword('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Modal.Root>
              <Modal.Title onClose={handleClose} visible>
                Deletar Conta
              </Modal.Title>

              <Modal.Description>
                Insira a sua senha para deletar a sua conta. <br /> Essa ação NÃO poderá ser
                desfeita.
              </Modal.Description>

              <div className="flex w-full flex-col pt-4">
                <InputLabel
                  id="password"
                  label="Insira sua senha"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Senha atual"
                  type="password"
                  value={password}
                />
              </div>

              <Modal.Actions className="flex justify-center gap-3 pt-6">
                <Button
                  disabled={isPending}
                  onClick={handleClose}
                  size="medium"
                  type="button"
                  variant="neutral"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => void handleConfirm()}
                  size="medium"
                  type="button"
                  variant="destructive"
                >
                  {isPending ? 'Deletando...' : 'Deletar'}
                </Button>
              </Modal.Actions>
            </Modal.Root>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

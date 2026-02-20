import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import { useAuth, useCurrentUser } from '@/contexts/user/userContext';
import { useRequestResetPassword } from '@/features/forgot-password';
import { updateUser } from '@/services/beasybox-api/user';

export const useProfileTab = () => {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const { isPending: isRequestResetPending, mutateAsync: requestResetPassword } =
    useRequestResetPassword();
  const { logout, refreshUser } = useAuth();

  const [name, setName] = useState(user.name ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [resetTokenId, setResetTokenId] = useState('');
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const hasChanges = name !== (user.name ?? '');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(user.id, { name });
      await refreshUser();
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch {
      showToast('Erro ao atualizar perfil. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user.email) {
      showToast('Email não encontrado.', 'error');
      return;
    }

    try {
      const { id } = await requestResetPassword({ email: user.email });
      setResetTokenId(id);
      setIsChangePasswordOpen(true);
      showToast('Código de verificação enviado para seu email.', 'success');
    } catch {
      showToast('Erro ao iniciar alteração de senha.', 'error');
    }
  };

  const handleCancel = () => {
    setName(user.name ?? '');
  };

  return {
    handleCancel,
    handleChangePassword,
    handleSave,
    hasChanges,
    isChangePasswordOpen,
    isDeleteAccountOpen,
    isRequestResetPending,
    isSaving,
    logout,
    name,
    resetTokenId,
    setIsChangePasswordOpen,
    setIsDeleteAccountOpen,
    setName,
    user,
  };
};

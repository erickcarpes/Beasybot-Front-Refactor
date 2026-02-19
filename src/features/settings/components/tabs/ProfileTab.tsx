import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useToast } from '@/contexts/toastContext';
import { useAuth, useCurrentUser } from '@/contexts/user/userContext';
import { ForgotPasswordFlow, useRequestResetPassword } from '@/features/forgot-password';
import { updateUser, useDeleteUser } from '@/services/beasybox-api/user';

export default function ProfileTab() {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { isPending: isRequestResetPending, mutateAsync: requestResetPassword } =
    useRequestResetPassword();
  const { logout, refreshUser } = useAuth();

  const [name, setName] = useState(user.name ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [resetTokenId, setResetTokenId] = useState('');

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

  return (
    <>
      <div className="relative flex w-full max-w-3xl flex-col gap-6">
        <section className="border-border-dark-gray flex flex-col gap-6 rounded-xl border bg-white/2 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-component-default flex size-10 items-center justify-center rounded-lg shadow-sm">
              <User className="text-text-white" size={20} />
            </div>
            <h3 className="text-body-l text-text-white font-semibold">Dados Pessoais</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-body-s text-text-gray font-medium" htmlFor="name-input">
                Nome de exibição
              </label>
              {/* Input with inset look: bg-black/20 and dark border */}
              <input
                className="border-border-dark-gray text-text-white placeholder:text-text-gray focus:border-text-gray h-10 w-full rounded-lg border bg-black/20 px-3 text-sm transition-all outline-none focus:bg-black/30"
                id="name-input"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Digite seu nome"
                type="text"
                value={name}
              />
            </div>

            {/* Email (Read-only) */}
            <div className="flex flex-col gap-2">
              <label className="text-body-s text-text-gray font-medium">Email</label>
              <div className="border-border-dark-gray text-text-gray flex h-10 w-full items-center gap-2 rounded-lg border bg-black/20 px-3 text-sm opacity-70">
                <Mail size={14} />
                <span>{user.email}</span>
                <Lock className="ml-auto opacity-50" size={12} />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Security */}
        <section className="border-border-dark-gray flex flex-col gap-6 rounded-xl border bg-white/2 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-component-default flex size-10 items-center justify-center rounded-lg shadow-sm">
              <Shield className="text-text-white" size={20} />
            </div>
            <h3 className="text-body-l text-text-white font-semibold">Segurança e Acesso</h3>
          </div>

          <div className="flex flex-col gap-6">
            {/* Password Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-body-s text-text-white font-medium">Senha</span>
                <span className="text-body-xs text-text-gray">
                  Gerencie sua senha de acesso à plataforma
                </span>
              </div>
              <Button
                disabled={isRequestResetPending}
                onClick={() => void handleChangePassword()}
                size="small"
                type="button"
                variant="neutral"
              >
                {isRequestResetPending ? 'Enviando...' : 'Alterar senha'}
              </Button>
            </div>

            {/* Logout Row */}
            <div className="border-border-dark-gray flex items-center justify-between gap-4 border-t pt-6">
              <div className="flex flex-col">
                <span className="text-body-s text-text-white font-medium">Sessão</span>
                <span className="text-body-xs text-text-gray">
                  Desconectar desta conta neste dispositivo
                </span>
              </div>
              <Button onClick={() => void logout()} size="small" type="button" variant="neutral">
                Sair da conta
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION: Danger Zone (Refined) */}
        <section className="border-border-dark-gray flex flex-col gap-6 rounded-xl border bg-white/2 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-body-s text-text-white font-medium">Zona de Perigo</span>
              <span className="text-body-xs text-text-gray max-w-lg">
                Ações irreversíveis relacionadas à sua conta
              </span>
            </div>
            <Button
              onClick={() => void deleteUser({ id: user.id })}
              size="small"
              type="button"
              variant="destructive"
            >
              Deletar conta
            </Button>
          </div>
        </section>

        {/* Unsaved Changes Footer */}
        <AnimatePresence>
          {hasChanges ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="border-border-dark-gray bg-component-default fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border p-2 shadow-2xl"
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pl-4">
                <span className="text-body-s text-text-white font-medium">
                  Você tem alterações não salvas
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleCancel} size="small" type="button" variant="neutral">
                  Descartar
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={() => void handleSave()}
                  size="small"
                  type="button"
                  variant="primary"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <ForgotPasswordFlow
        initialEmail={user.email}
        initialStep="VERIFY_CODE"
        initialTokenId={resetTokenId}
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
        }}
      />
    </>
  );
}

import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/user/userContext';

import { type LoginFormData, useLoginForm } from './useLoginForm';

export const useLoginFlow = () => {
  const { errors, handleSubmit, isValid, register, setError } = useLoginForm();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        setIsPending(true);
        await login(data.email, data.password);
        showToast('Login realizado com sucesso!', 'success');
        void navigate({ to: '/app/home' });
      } catch {
        showToast('Email ou senha incorretos.', 'error');
        setError('password', { message: 'Email ou senha incorretos' });
      } finally {
        setIsPending(false);
      }
    },
    [login, showToast, navigate, setError],
  );

  return {
    errors,
    handleSubmit,
    isPending,
    isValid,
    onSubmit,
    register,
  };
};

import { useCallback } from 'react';

import { useToast } from '@/contexts/toastContext';

import { type SignupRequest, useSignupFormService } from '../services/signup';
import { type SignupFormData, useSignupForm } from './useSignupForm';

export const useSignupFlow = () => {
  const { errors, handleSubmit, isValid, register, requirements, setValue } = useSignupForm();
  const { isPending, mutateAsync } = useSignupFormService();
  const { showToast } = useToast();

  const onSubmit = useCallback(
    async (data: SignupFormData) => {
      const payload: SignupRequest = {
        email: data.email,
        inviteCode: data.inviteCode,
        name: data.name,
        password: data.password,
      };

      try {
        await mutateAsync(payload);
        showToast('Conta criada! Verifique seu e-mail.', 'success');
      } catch {
        showToast('Não foi possível criar a conta.', 'error');
      }
    },
    [mutateAsync, showToast],
  );

  return {
    errors,
    handleSubmit,
    isPending,
    isValid,
    onSubmit,
    register,
    requirements,
    setValue,
  };
};

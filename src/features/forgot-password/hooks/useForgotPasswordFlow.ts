import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';

import {
  useConfirmResetPassword,
  useRequestResetPassword,
  useValidateResetPassword,
} from '../service/forgotPassword';

export type ForgotPasswordStep = 'NEW_PASSWORD' | 'REQUEST_RESET' | 'VERIFY_CODE';

interface UseForgotPasswordFlowOptions {
  initialEmail?: string;
  initialStep?: ForgotPasswordStep;
  initialTokenId?: string;
}

interface UseForgotPasswordFlowReturn {
  currentStep: ForgotPasswordStep;
  email: string;
  handleNewPasswordNext: (password: string) => Promise<void>;
  handleRequestResetNext: (email: string) => Promise<void>;
  handleVerifyCodeNext: (code: string) => Promise<void>;
  handleVerifyCodeResend: () => Promise<void>;
  isConfirmResetPending: boolean;
  isRequestResetPending: boolean;
  isValidateResetPending: boolean;
  resetFlow: () => void;
}

export const useForgotPasswordFlow = (
  onClose: () => void,
  options: UseForgotPasswordFlowOptions = {},
): UseForgotPasswordFlowReturn => {
  const { initialEmail = '', initialStep = 'REQUEST_RESET', initialTokenId = '' } = options;

  const [step, setStep] = useState<ForgotPasswordStep>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [tokenId, setTokenId] = useState(initialTokenId);

  const { isPending: isRequestResetPending, mutateAsync: requestResetPassword } =
    useRequestResetPassword();
  const { isPending: isValidateResetPending, mutateAsync: validateResetPassword } =
    useValidateResetPassword();
  const { isPending: isConfirmResetPending, mutateAsync: confirmResetPassword } =
    useConfirmResetPassword();

  const { showToast } = useToast();

  const resetFlow = () => {
    setStep(initialStep);
    setToken('');
    setTokenId(initialTokenId);
    setEmail(initialEmail);
    onClose();
  };

  const handleRequestResetNext = async (emailInput: string) => {
    setEmail(emailInput);
    await requestResetPassword(
      { email: emailInput },
      {
        onError: () => {
          showToast('Erro ao solicitar reset de senha', 'error');
        },
        onSuccess: ({ id }) => {
          setTokenId(id);
          setStep('VERIFY_CODE');
        },
      },
    );
  };

  const handleVerifyCodeNext = async (code: string) => {
    await validateResetPassword(
      { token: code, tokenId },
      {
        onError: () => {
          showToast('Erro ao validar código', 'error');
        },
        onSuccess: () => {
          setStep('NEW_PASSWORD');
          setToken(code);
        },
      },
    );
  };

  const handleVerifyCodeResend = async () => {
    await requestResetPassword(
      { email },
      {
        onError: () => {
          showToast('Erro ao reenviar código', 'error');
        },
        onSuccess: ({ id }) => {
          setTokenId(id);
          showToast('Código reenviado com sucesso!', 'success');
          setStep('VERIFY_CODE');
        },
      },
    );
  };

  const handleNewPasswordNext = async (newPassword: string) => {
    await confirmResetPassword(
      { newPassword, token, tokenId },
      {
        onError: () => {
          showToast('Erro ao confirmar reset de senha', 'error');
        },
        onSuccess: () => {
          showToast('Senha alterada com sucesso!', 'success');
          resetFlow();
        },
      },
    );
  };

  return {
    currentStep: step,
    email,
    handleNewPasswordNext,
    handleRequestResetNext,
    handleVerifyCodeNext,
    handleVerifyCodeResend,
    isConfirmResetPending,
    isRequestResetPending,
    isValidateResetPending,
    resetFlow,
  };
};

import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import { useValidatePhoneCode, useVerifyPhone } from '@/services/beasybox-api/auth';

export const useWhatsAppIntegration = () => {
  const { showToast } = useToast();

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [step, setStep] = useState<'CODE' | 'PHONE'>('PHONE');

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [tokenId, setTokenId] = useState('');

  const { isPending: isVerifying, mutateAsync: verifyPhone } = useVerifyPhone();
  const { isPending: isValidating, mutateAsync: validateCode } = useValidatePhoneCode();

  const handleIntegrateWhatsApp = () => {
    setIsWhatsAppModalOpen(true);
    setStep('PHONE');
    setPhone('');
    setCode('');
  };

  const handleSendPhone = async () => {
    if (!phone) {
      showToast('Por favor, insira um número de telefone.', 'error');
      return;
    }

    try {
      const response = await verifyPhone({ phone });
      setTokenId(response.id);
      setStep('CODE');
      showToast('Código enviado para o seu WhatsApp!', 'success');
    } catch {
      showToast('Erro ao enviar o código. Verifique o número e tente novamente.', 'error');
    }
  };

  const handleValidateCode = async () => {
    if (code.length !== 4) {
      showToast('O código deve conter 4 dígitos.', 'error');
      return;
    }

    try {
      const response = await validateCode({ token: code, tokenId });
      if (response.success) {
        showToast('WhatsApp integrado com sucesso!', 'success');
        setIsWhatsAppModalOpen(false);
        // TODO: Invalidate user query or update user context to reflect the new phone
      } else {
        showToast(response.message ?? 'Código inválido.', 'error');
      }
    } catch {
      showToast('Erro ao validar o código. Tente novamente.', 'error');
    }
  };

  return {
    code,
    handleIntegrateWhatsApp,
    handleSendPhone,
    handleValidateCode,
    isValidating,
    isVerifying,
    isWhatsAppModalOpen,
    phone,
    setCode,
    setIsWhatsAppModalOpen,
    setPhone,
    step,
  };
};

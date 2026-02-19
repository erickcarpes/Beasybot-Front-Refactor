import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/user/userContext';

import type { ChatMessage, OnboardingPayload, StepId } from '../types';

import { ONBOARDING_CONFIG, STEP_ORDER, TOTAL_STEPS } from '../constants/onboardingConfig';
import { useCreateOnboarding } from '../services/onboarding';

// ============================================================================
// Helpers
// ============================================================================

let messageIdCounter = 0;

const createMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  content,
  id: `msg-${String(Date.now())}-${String(++messageIdCounter)}`,
  role,
});

const getStepText = (stepId: StepId, userName?: string): string => {
  const step = ONBOARDING_CONFIG[stepId];
  return typeof step.text === 'function' ? step.text(userName) : step.text;
};

// ============================================================================
// Hook
// ============================================================================

export const useOnboarding = () => {
  const { refreshUser, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isPending: isSubmitting, mutateAsync: createOnboarding } = useCreateOnboarding();

  // ── State ──────────────────────────────────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingPayload>({});
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage('bot', getStepText(STEP_ORDER[0], user?.name ?? undefined)),
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentStepId = STEP_ORDER[currentStepIndex];
  const currentStep = ONBOARDING_CONFIG[currentStepId];
  const isLastStep = currentStepId === 'stepFinal';
  const progress = currentStepIndex / TOTAL_STEPS;

  /**
   * Avança para o próximo step, adicionando a mensagem do bot com delay de typing
   */
  const advanceToNextStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex >= STEP_ORDER.length) return;

      setIsTyping(true);

      const timer = setTimeout(() => {
        const nextStepId = STEP_ORDER[nextIndex];
        const nextStep = ONBOARDING_CONFIG[nextStepId];

        // Adiciona descrição como mensagem auxiliar se existir (e for string)
        const description = nextStep.description;
        const descriptionText = typeof description === 'string' ? description : undefined;

        setMessages((previous) => [
          ...previous,
          createMessage('bot', getStepText(nextStepId, user?.name ?? undefined)),
          ...(descriptionText ? [createMessage('bot', descriptionText)] : []),
        ]);

        setCurrentStepIndex(nextIndex);
        setIsTyping(false);
      }, 800);

      return () => {
        clearTimeout(timer);
      };
    },
    [user?.name],
  );

  /**
   * Processa seleção de uma opção
   */
  const handleOptionSelect = useCallback(
    (value: string) => {
      const step = ONBOARDING_CONFIG[currentStepId];
      const selectedOption = step.options?.find((opt) => opt.value === value);
      if (!selectedOption) return;

      // Adiciona resposta do usuário ao chat
      setMessages((previous) => [...previous, createMessage('user', selectedOption.label)]);

      // Se tem descrição dinâmica (function), mostra após seleção (step5 tone)
      const description = step.description;
      if (typeof description === 'function') {
        const descText = description(value);
        setTimeout(() => {
          setMessages((previous) => [...previous, createMessage('bot', descText)]);
        }, 400);
      }

      // Salva resposta
      const { apiId } = step;
      if (apiId) {
        setAnswers((previous) => ({ ...previous, [apiId]: value }));
      }

      // Avança
      const nextIndex = currentStepIndex + 1;
      advanceToNextStep(nextIndex);
    },
    [currentStepId, currentStepIndex, advanceToNextStep],
  );

  /**
   * Processa envio de input de texto
   */
  const handleInputSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      const step = ONBOARDING_CONFIG[currentStepId];

      // Adiciona resposta do usuário ao chat
      setMessages((previous) => [...previous, createMessage('user', trimmed)]);

      // Salva resposta
      const { apiId } = step;
      if (apiId) {
        setAnswers((previous) => ({ ...previous, [apiId]: trimmed }));
      }

      // Avança
      const nextIndex = currentStepIndex + 1;
      advanceToNextStep(nextIndex);
    },
    [currentStepId, currentStepIndex, advanceToNextStep],
  );

  /**
   * Processa o step de review (step7) — confirma e avança
   */
  const handleReviewConfirm = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    advanceToNextStep(nextIndex);
  }, [currentStepIndex, advanceToNextStep]);

  /**
   * Pula o onboarding inteiro (skip)
   */
  const handleSkip = useCallback(async () => {
    try {
      await createOnboarding(answers);
      await refreshUser();
      void navigate({ to: '/app/home' });
    } catch {
      showToast('Erro ao salvar. Tente novamente.', 'error');
    }
  }, [answers, createOnboarding, navigate, refreshUser, showToast]);

  /**
   * Envia as respostas finais e conclui o onboarding
   */
  const handleFinish = useCallback(
    async (finalStepValue?: string) => {
      try {
        await createOnboarding(answers);
        await refreshUser();

        if (finalStepValue === 'send-files') {
          // Redireciona para a página de knowledge (upload de arquivos)
          void navigate({ search: {}, to: '/app/knowledge' });
        } else {
          void navigate({ to: '/app/home' });
        }

        showToast('Onboarding concluído com sucesso! 🎉', 'success');
      } catch {
        showToast('Erro ao salvar. Tente novamente.', 'error');
      }
    },
    [answers, createOnboarding, navigate, refreshUser, showToast],
  );

  return useMemo(
    () => ({
      currentStep,
      currentStepId,
      handleFinish,
      handleInputSubmit,
      handleOptionSelect,
      handleReviewConfirm,
      handleSkip,
      isLastStep,
      isSubmitting,
      isTyping,
      messages,
      progress,
    }),
    [
      currentStep,
      currentStepId,
      handleFinish,
      handleInputSubmit,
      handleOptionSelect,
      handleReviewConfirm,
      handleSkip,
      isLastStep,
      isSubmitting,
      isTyping,
      messages,
      progress,
    ],
  );
};

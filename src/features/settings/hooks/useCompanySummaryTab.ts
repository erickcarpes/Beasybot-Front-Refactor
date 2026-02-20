import type React from 'react';

import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';

export const useCompanySummaryTab = () => {
  const { showToast } = useToast();

  // TODO: Fetch company summary from the backend
  const [summary, setSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement the service call to update the company summary
      // example: await updateCompanySummary(summary);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Mocking API call
      setHasChanges(false);
      showToast('Resumo da empresa atualizado com sucesso!', 'success');
    } catch {
      showToast('Erro ao atualizar resumo. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement the service call to generate a new summary using AI
      // example: const newSummary = await generateCompanySummary();
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mocking AI generation
      setSummary('Este é um novo resumo gerado pela Inteligência Artificial...');
      setHasChanges(true);
      showToast('Resumo gerado com sucesso!', 'success');
    } catch {
      showToast('Erro ao gerar resumo. Tente novamente.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    // TODO: Revert to original summary
    setHasChanges(false);
  };

  return {
    handleCancel,
    handleChange,
    handleGenerateAI,
    handleSave,
    hasChanges,
    isGenerating,
    isSaving,
    summary,
  };
};

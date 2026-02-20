import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';

export const usePreferencesTab = () => {
  const { showToast } = useToast();

  // TODO: Fetch user preferences from the backend
  const [preferences, setPreferences] = useState({
    businessSegment: '',
    jobRole: '',
    preferredTone: '',
    usageFocus: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelect = (field: keyof typeof preferences, value: string) => {
    setPreferences((previous) => ({ ...previous, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement the service call to update preferences
      // example: await updatePreferences(preferences);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Mocking API call
      setHasChanges(false);
      showToast('Preferências atualizadas com sucesso!', 'success');
    } catch {
      showToast('Erro ao atualizar preferências. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // TODO: Revert to original preferences
    setHasChanges(false);
  };

  return { handleCancel, handleSave, handleSelect, hasChanges, isSaving, preferences };
};

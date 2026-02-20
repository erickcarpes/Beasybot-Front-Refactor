import { useMutation } from '@tanstack/react-query';

import api from '@/services/beasybox-api/api';

// ============================================================================
// Types
// ============================================================================

export interface OnboardingPayload {
  readonly businessSegment?: string;
  readonly companyName?: string;
  readonly importantLinks?: string;
  readonly jobRole?: string;
  readonly preferredTone?: string;
  readonly usageFocus?: string;
}

interface OnboardingResponse {
  readonly id: string;
}

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Hook para criar o onboarding
 */
export const useCreateOnboarding = () => {
  return useMutation({
    mutationFn: async (payload: OnboardingPayload) => {
      const response = await api.post<OnboardingResponse>('/onboarding', payload);
      return response.data;
    },
  });
};

/**
 * Hook para atualizar o onboarding
 */
export const useUpdateOnboarding = () => {
  return useMutation({
    mutationFn: async (payload: Partial<OnboardingPayload>) => {
      const response = await api.patch<OnboardingResponse>('/onboarding', payload);
      return response.data;
    },
  });
};

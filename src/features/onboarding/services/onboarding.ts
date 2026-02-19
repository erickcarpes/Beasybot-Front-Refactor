import { useMutation } from '@tanstack/react-query';

import api from '@/services/beasybox-api/api';

import type { OnboardingPayload } from '../types';

// ============================================================================
// Types
// ============================================================================

interface OnboardingResponse {
  readonly id: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Cria o onboarding do usuário (primeira vez)
 */
export const createOnboarding = async (payload: OnboardingPayload): Promise<OnboardingResponse> => {
  const response = await api.post<OnboardingResponse>('/onboarding', payload);
  return response.data;
};

/**
 * Atualiza o onboarding do usuário
 */
export const updateOnboarding = async (
  payload: Partial<OnboardingPayload>,
): Promise<OnboardingResponse> => {
  const response = await api.patch<OnboardingResponse>('/onboarding', payload);
  return response.data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Hook para criar o onboarding
 */
export const useCreateOnboarding = () => {
  return useMutation({
    mutationFn: createOnboarding,
    mutationKey: ['onboarding', 'create'],
  });
};

/**
 * Hook para atualizar o onboarding
 */
export const useUpdateOnboarding = () => {
  return useMutation({
    mutationFn: updateOnboarding,
    mutationKey: ['onboarding', 'update'],
  });
};

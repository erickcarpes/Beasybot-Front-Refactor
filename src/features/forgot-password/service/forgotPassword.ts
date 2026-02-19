import { useMutation } from '@tanstack/react-query';

import api from '@/services/beasybox-api/api';

export interface ResetPasswordResponse {
  expiresAt: string;
  id: string;
  isRevoked: boolean;
}

interface ResetPasswordPayload {
  email: string;
}

export const useRequestResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await api.post<ResetPasswordResponse>(
        '/auth/reset-password/request',
        payload,
      );
      return response.data;
    },
  });
};

export interface ValidateResetPasswordRequest {
  token: string;
  tokenId: string;
}

export interface ValidateResetPasswordResponse {
  message?: string;
  success: boolean;
}

export const useValidateResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ValidateResetPasswordRequest) => {
      const response = await api.post<ValidateResetPasswordResponse>(
        '/auth/reset-password/validate',
        payload,
      );
      return response.data;
    },
  });
};

interface ConfirmResetPasswordRequest {
  newPassword: string;
  token: string;
  tokenId: string;
}

interface ConfirmResetPasswordResponse {
  message?: string;
  success: boolean;
}

export const useConfirmResetPassword = () => {
  return useMutation<ConfirmResetPasswordResponse, unknown, ConfirmResetPasswordRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ConfirmResetPasswordResponse>('/auth/reset-password', data);
      return response.data;
    },
  });
};

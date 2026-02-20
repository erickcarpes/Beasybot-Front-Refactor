import { useMutation } from '@tanstack/react-query';

import { apiAuth } from './api';
import { setAccessToken } from './tokenManager';

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

interface LogoutResponse {
  message: string;
}

// ============================================================================
// Auth API Functions
// ============================================================================

/**
 * Realiza login e armazena o access token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiAuth.post<LoginResponse>('/auth/login', credentials);
  const { accessToken } = response.data;

  setAccessToken(accessToken);

  return response.data;
};

/**
 * Realiza logout e limpa o access token
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiAuth.post<LogoutResponse>('/auth/logout');

  setAccessToken(null);

  return response.data;
};

/**
 * Renova os tokens usando o refresh token (cookie)
 * Retorna o novo access token
 */
export const refreshTokens = async (): Promise<string> => {
  const response = await apiAuth.post<LoginResponse>('/auth/refresh');
  const { accessToken } = response.data;

  setAccessToken(accessToken);

  return accessToken;
};

import api from '@/services/beasybox-api/api';

interface VerifyPhoneRequest {
  phone: string;
}

interface VerifyPhoneResponse {
  expiresAt: Date;
  id: string;
  isRevoked: boolean;
  phone: string;
}

export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: async (payload: VerifyPhoneRequest) => {
      const response = await api.post<VerifyPhoneResponse>('/auth/verify-phone', payload);
      return response.data;
    },
  });
};

interface ValidatePhoneCodeRequest {
  token: string;
  tokenId: string;
}

interface ValidatePhoneCodeResponse {
  message?: string;
  success: boolean;
}

export const useValidatePhoneCode = () => {
  return useMutation({
    mutationFn: async (payload: ValidatePhoneCodeRequest) => {
      const response = await api.post<ValidatePhoneCodeResponse>(
        '/auth/verify-phone/validate',
        payload,
      );
      return response.data;
    },
  });
};

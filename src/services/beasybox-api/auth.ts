import { apiAuth, setAccessToken } from './api';

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

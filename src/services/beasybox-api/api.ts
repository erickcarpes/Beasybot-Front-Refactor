import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getAccessToken, setAccessToken } from './tokenManager';

const baseURL =
  (import.meta.env.VITE_BEASYBOX_API as string | undefined) ?? 'http://localhost:3000';

/**
 * API principal - usa interceptors para auth
 */
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
});

/**
 * API para refresh - sem interceptors para evitar loop infinito
 */
export const apiAuth = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
});

// ============================================================================
// Refresh Queue (evita múltiplos refreshes simultâneos)
// ============================================================================

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeToTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string): void => {
  for (const callback of refreshSubscribers) {
    callback(token);
  }
  refreshSubscribers = [];
};

// ============================================================================
// Interceptors
// ============================================================================

/**
 * REQUEST - Adiciona Authorization header automaticamente
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    throw error;
  },
);

/**
 * RESPONSE - Auto-refresh em 401
 *
 * Quando uma requisição retorna 401:
 * 1. Tenta renovar o token via /auth/refresh
 * 2. Se conseguir, re-executa a requisição original
 * 3. Se falhar, redireciona para /login
 *
 * Requisições simultâneas que falham com 401 são enfileiradas
 * e re-executadas após o refresh completar.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as { _retry?: boolean } & InternalAxiosRequestConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    originalRequest._retry = true;

    // Enfileira se já está refreshing
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeToTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { refreshTokens } = await import('./auth');
      const newToken = await refreshTokens();

      onTokenRefreshed(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return await api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      globalThis.location.href = '/login';
      return refreshError;
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

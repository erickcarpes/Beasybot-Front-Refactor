import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL =
  (import.meta.env.VITE_BEASYBOX_API as string | undefined) ?? 'http://localhost:3000';

// Armazena o access token em memória (mais seguro que localStorage)
let accessToken: null | string = null;

/**
 * Atualiza o access token em memória
 */
export const setAccessToken = (token: null | string): void => {
  accessToken = token;
};

/**
 * Retorna o access token atual
 */
export const getAccessToken = (): null | string => accessToken;

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

// Flag para evitar múltiplos refreshes simultâneos
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => {
    callback(token);
  });
  refreshSubscribers = [];
};

/**
 * Interceptor de REQUEST - adiciona Authorization header
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error: AxiosError) => Promise.reject(error),
);

/**
 * Interceptor de RESPONSE - auto-refresh em 401
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se não é 401 ou já tentou retry, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Marca que já tentou retry
    originalRequest._retry = true;

    // Se já está refreshing, aguarda na fila
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
      // Importação dinâmica para evitar dependência circular
      const { refreshTokens } = await import('./auth');
      const newToken = await refreshTokens();

      setAccessToken(newToken);
      onTokenRefreshed(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh falhou - limpa token e redireciona para login
      setAccessToken(null);
      globalThis.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

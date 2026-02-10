import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  login as loginApi,
  logout as logoutApi,
  refreshTokens,
} from '@/services/beasybox-api/auth';
import {
  clearAccessToken,
  decodeTokenPayload,
  getAccessToken,
} from '@/services/beasybox-api/tokenManager';
import { fetchUser, type User } from '@/services/beasybox-api/user';

// ============================================================================
// Types
// ============================================================================

interface AuthContextValue {
  /** Se o usuário está autenticado */
  readonly isAuthenticated: boolean;
  /** Se está carregando o estado inicial de autenticação */
  readonly isLoading: boolean;
  /** Realiza login com email e senha */
  readonly login: (email: string, password: string) => Promise<void>;
  /** Realiza logout */
  readonly logout: () => Promise<void>;
  /** Dados do usuário logado */
  readonly user: null | User;
}

interface AuthProviderProps {
  readonly children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

/**
 * Extrai o userId do access token e busca os dados do usuário
 */
const fetchUserFromToken = async (): Promise<null | User> => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  return fetchUser(payload.sub);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  /**
   * Tenta restaurar a sessão ao carregar a página
   * Usa o refresh token (cookie) para obter um novo access token
   */
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        await refreshTokens();
        const userData = await fetchUserFromToken();
        setUser(userData);
      } catch {
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };

    void hydrateAuth();
  }, []);

  /**
   * Login com email e senha
   */
  const login = useCallback(async (email: string, password: string) => {
    await loginApi({ email, password });
    const userData = await fetchUserFromToken();
    setUser(userData);
  }, []);

  /**
   * Logout - limpa token e user
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      user,
    }),
    [isAuthenticated, isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook para acessar o contexto de autenticação
 * @throws Error se usado fora do AuthProvider
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

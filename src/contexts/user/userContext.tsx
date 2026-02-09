import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getAccessToken, setAccessToken } from '@/services/beasybox-api/api';
import { login as loginApi, logout as logoutApi, refreshTokens } from '@/services/beasybox-api/auth';
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

export function AuthProvider({ children }: AuthProviderProps) {
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
        // Tenta renovar o token usando o cookie
        await refreshTokens();

        // Se conseguiu, busca os dados do usuário
        // Decodifica o token para pegar o userId
        const token = getAccessToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1])) as { sub: string };
          const userData = await fetchUser(payload.sub);
          setUser(userData);
        }
      } catch {
        // Refresh falhou - usuário não está logado
        setAccessToken(null);
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
    const response = await loginApi({ email, password });

    // Decodifica o token para pegar o userId
    const payload = JSON.parse(atob(response.accessToken.split('.')[1])) as { sub: string };
    const userData = await fetchUser(payload.sub);

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
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook para acessar o contexto de autenticação
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

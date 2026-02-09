import { Navigate, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useAuth } from '@/contexts/user/userContext';

interface ProtectedRouteProps {
  readonly children: ReactNode;
  /** Rota para redirecionar se não autenticado */
  readonly redirectTo?: string;
}

/**
 * Wrapper que protege rotas autenticadas
 * Redireciona para login se o usuário não está autenticado
 */
export default function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Enquanto carrega, mostra loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="border-brand h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  // Se não autenticado, redireciona
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} search={{ redirect: location.pathname }} />;
  }

  return <>{children}</>;
}

import { Navigate, Outlet, useLocation } from '@tanstack/react-router';

import { useAuth } from '@/contexts/user/userContext';

interface ProtectedRouteProps {
  /** Rota para redirecionar se não autenticado */
  readonly redirectTo?: string;
}

/**
 * Wrapper que protege rotas autenticadas.
 * - Redireciona para login se não autenticado.
 * - Redireciona para onboarding se `isOnboarded === false`.
 */
export default function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
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
    return <Navigate to={redirectTo} />;
  }

  // Se não completou onboarding e não está na rota de onboarding, redireciona
  const isOnOnboarding = location.pathname.includes('/onboarding');
  if (user && !user.isOnboarded && !isOnOnboarding) {
    return <Navigate to="/app/onboarding" />;
  }

  return <Outlet />;
}

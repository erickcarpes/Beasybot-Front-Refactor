import { useQuery } from '@tanstack/react-query';

import api from './api';

// ============================================================================
// Types
// ============================================================================

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  cpf?: string;
  createdAt: Date;
  email: string;
  id: string;
  isOnboarded: boolean;
  name?: string;
  phone?: string;
  role: RoleEnum;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Busca os dados do usuário pelo ID
 */
export const fetchUser = async (userId: string): Promise<User> => {
  const response = await api.get<User>(`/user/${userId}`);
  return response.data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

interface UseUserOptions {
  userId: string;
}

/**
 * Hook para buscar dados do usuário
 * Só executa quando userId está definido
 */
export const useUser = ({ userId }: UseUserOptions) => {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchUser(userId),
    queryKey: ['user', userId],
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

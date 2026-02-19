import { useMutation, useQuery } from '@tanstack/react-query';

import api from './api';

// ============================================================================
// Types
// ============================================================================

export type RoleEnum = 'ADMIN' | 'USER';

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

/**
 * Atualiza os dados do usuário
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>(`/user/${userId}`, data);
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

interface DeleteUserRequest {
  id: string;
}

/**
 * Hook para deletar um usuário
 */
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async ({ id }: DeleteUserRequest) => {
      const response = await api.delete<boolean>(`/user/${id}`);
      return response.data;
    },
  });
};

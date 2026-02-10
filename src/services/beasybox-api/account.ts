import { useQuery } from '@tanstack/react-query';

import api from './api';

// ============================================================================
// Types
// ============================================================================

export interface Account {
  accountTier: AccountTierEnum;
  id: string;
  meetingSecondsUsed: number;
  signatureEndDate?: Date;
  signatureId?: string;
  signatureStartDate?: Date;
  status: AccountStatusEnum;
  storageUsedInBytes: number;
  tokensUsed: number;
}

export type AccountStatusEnum = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type AccountTierEnum = 'FREE' | 'PREMIUM' | 'PRO';

// ============================================================================
// API Functions
// ============================================================================

/**
 * Busca os dados da conta pelo ID
 */
export const fetchAccount = async (accountId: string): Promise<Account> => {
  const response = await api.get<Account>(`/account/${accountId}`);
  return response.data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

interface UseAccountOptions {
  accountId: string;
}

/**
 * Hook para buscar dados da conta
 * Só executa quando accountId está definido
 */
export const useAccount = ({ accountId }: UseAccountOptions) => {
  return useQuery({
    enabled: Boolean(accountId),
    queryFn: () => fetchAccount(accountId),
    queryKey: ['account', accountId],
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

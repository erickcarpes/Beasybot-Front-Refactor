import { useQuery } from '@tanstack/react-query';

import api from './api';

// ============================================================================
// Types
// ============================================================================

export enum AccountStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AccountTierEnum {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PRO = 'PRO',
}

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

import { useCurrentUser } from '@/contexts/user/userContext';
import { useAccount } from '@/services/beasybox-api/account';

export const getPlanName = (tier: string) => {
  switch (tier) {
    case 'FREE': {
      return 'Plano Básico';
    }
    case 'PREMIUM': {
      return 'Plano Premium';
    }
    case 'PRO': {
      return 'Plano Pro';
    }
    default: {
      return 'Plano Básico';
    }
  }
};

export const usePlanAndSubscriptionTab = () => {
  const user = useCurrentUser();
  const { data: account, isError, isLoading } = useAccount({ accountId: user.id });

  return { account, getPlanName, isError, isLoading };
};

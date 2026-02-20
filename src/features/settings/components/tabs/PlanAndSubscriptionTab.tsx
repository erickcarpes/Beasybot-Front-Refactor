import { usePlanAndSubscriptionTab } from '../../hooks/usePlanAndSubscriptionTab';
import PlanCard from '../cards/PlanCard';
import UsageStatsCard from '../cards/UsageStatsCard';

export default function PlanAndSubscriptionTab() {
  const { account, getPlanName, isError, isLoading } = usePlanAndSubscriptionTab();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <span className="text-body-m text-text-gray">Carregando informações do plano...</span>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <span className="text-body-m text-red-500">
          Não foi possível carregar as informações do plano.
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-4xl flex-col gap-6">
      <PlanCard account={account} getPlanName={getPlanName} />
      <UsageStatsCard account={account} />
    </div>
  );
}

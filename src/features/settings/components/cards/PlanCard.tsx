import { Calendar, CreditCard } from 'lucide-react';

import type { Account } from '@/services/beasybox-api/account';

interface PlanCardProps {
  readonly account: Account;
  readonly getPlanName: (tier: string) => string;
}

export default function PlanCard({ account, getPlanName }: PlanCardProps) {
  return (
    <section className="border-border-dark-gray from-brand/20 flex flex-col gap-6 rounded-xl border bg-gradient-to-br via-white/5 to-white/2 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand/20 flex size-12 items-center justify-center rounded-lg shadow-sm">
            <CreditCard className="text-brand" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-body-s text-text-white font-medium tracking-wider uppercase opacity-80">
              Seu Plano Atual
            </span>
            <h3 className="text-heading-m text-text-white font-bold">
              {getPlanName(account.accountTier)}
            </h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-heading-s text-text-white font-bold">
            {account.accountTier === 'FREE' ? 'Grátis' : 'Ativo'}
          </span>
          {account.status === 'ACTIVE' ? (
            <span className="bg-brand/20 text-brand mt-1 rounded-full px-2 py-0.5 text-xs font-medium">
              Ativo
            </span>
          ) : (
            <span className="mt-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-500">
              Inativo/Suspenso
            </span>
          )}
        </div>
      </div>

      {account.signatureEndDate && (
        <div className="border-border-dark-gray mt-2 flex items-center gap-2 border-t pt-4">
          <Calendar className="text-text-gray" size={16} />
          <span className="text-body-s text-text-gray">
            Válido até:{' '}
            <strong className="text-text-white">
              {new Date(account.signatureEndDate).toLocaleDateString('pt-BR')}
            </strong>
          </span>
        </div>
      )}
    </section>
  );
}

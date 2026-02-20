import { Clock, Database, Zap } from 'lucide-react';

import type { Account } from '@/services/beasybox-api/account';

import { formatBytes, formatSecondsToTime } from '@/utils/formatters';

interface UsageStatsCardProps {
  readonly account: Account;
}

export default function UsageStatsCard({ account }: UsageStatsCardProps) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {/* Meetings Usage */}
      <div className="border-border-dark-gray flex flex-col gap-4 rounded-xl border bg-white/2 p-5">
        <div className="flex items-center gap-3">
          <div className="bg-component-default flex size-10 items-center justify-center rounded-lg">
            <Clock className="text-text-white" size={20} />
          </div>
          <span className="text-body-m text-text-white font-medium">Reuniões</span>
        </div>
        <div className="flex flex-col">
          <span className="text-heading-s text-text-white font-bold">
            {formatSecondsToTime(account.meetingSecondsUsed)}
          </span>
          <span className="text-body-xs text-text-gray mt-1">Tempo utilizado neste ciclo</span>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="border-border-dark-gray flex flex-col gap-4 rounded-xl border bg-white/2 p-5">
        <div className="flex items-center gap-3">
          <div className="bg-component-default flex size-10 items-center justify-center rounded-lg">
            <Database className="text-text-white" size={20} />
          </div>
          <span className="text-body-m text-text-white font-medium">Armazenamento</span>
        </div>
        <div className="flex flex-col">
          <span className="text-heading-s text-text-white font-bold">
            {formatBytes(account.storageUsedInBytes)}
          </span>
          <span className="text-body-xs text-text-gray mt-1">Espaço ocupado por arquivos</span>
        </div>
      </div>

      {/* Tokens Usage */}
      <div className="border-border-dark-gray flex flex-col gap-4 rounded-xl border bg-white/2 p-5">
        <div className="flex items-center gap-3">
          <div className="bg-component-default flex size-10 items-center justify-center rounded-lg">
            <Zap className="text-text-white" size={20} />
          </div>
          <span className="text-body-m text-text-white font-medium">Tokens IA</span>
        </div>
        <div className="flex flex-col">
          <span className="text-heading-s text-text-white font-bold">
            {account.tokensUsed.toLocaleString('pt-BR')}
          </span>
          <span className="text-body-xs text-text-gray mt-1">
            Tokens consumidos gerando conteúdo
          </span>
        </div>
      </div>
    </section>
  );
}

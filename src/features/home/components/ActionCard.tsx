import { useNavigate } from '@tanstack/react-router';
import { type ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ActionCardProps {
  /** Ação a ser passada como search param para a página de destino */
  readonly action?: string;
  /** Descrição do card */
  readonly description: string;
  /** Ícone(s) na parte inferior do card */
  readonly icon: ReactNode;
  /** Título do card */
  readonly title: string;
  /** Rota para navegar ao clicar */
  readonly to: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Card de ação na Home page.
 * Redireciona para uma rota ao clicar, opcionalmente passando um search param `action`.
 */
export default function ActionCard({ action, description, icon, title, to }: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      className="button-neutral-no-border border-stroke-2 hover:border-stroke flex min-h-[160px] flex-1 cursor-pointer flex-col justify-between rounded-xl border p-5 text-left transition-all hover:scale-103"
      onClick={() => {
        void navigate({ search: action ? { action } : {}, to });
      }}
      type="button"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-body-m text-text-white font-semibold">{title}</h3>
        <p className="text-body-xs text-text-gray leading-relaxed">{description}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">{icon}</div>
    </button>
  );
}

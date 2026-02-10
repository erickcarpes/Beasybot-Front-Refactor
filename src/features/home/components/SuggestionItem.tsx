import { ChevronDown } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface SuggestionItemProps {
  /** Descrição da sugestão */
  readonly description: string;
  /** Se a sugestão está desabilitada (coming soon) */
  readonly disabled?: boolean;
  /** Título da sugestão */
  readonly title: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Item de sugestão inteligente na Home page.
 * Mostra título, descrição e badge "Em breve" quando desabilitado.
 */
export default function SuggestionItem({
  description,
  disabled = false,
  title,
}: SuggestionItemProps) {
  return (
    <div className="border-stroke-2 component-gradient hover:border-stroke flex cursor-not-allowed items-center justify-between rounded-xl border px-5 py-4 transition-colors">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="bg-brand inline-block size-2 shrink-0 rounded-full" />

          <span className="text-body-s text-text-white font-medium">{title}</span>

          {disabled && (
            <div className="outline-brand rounded-circle flex items-center justify-center px-3 py-0.5 outline">
              <span className="text-brand text-body-xs">Em breve</span>
            </div>
          )}
        </div>

        <p className="text-body-xs text-text-gray mt-1 ml-5">{description}</p>
      </div>

      <ChevronDown className="text-text-gray ml-4 size-5 shrink-0" />
    </div>
  );
}

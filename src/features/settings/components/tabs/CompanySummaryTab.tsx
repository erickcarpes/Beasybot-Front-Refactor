import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';

import Button from '@/components/ui/Button';

import { useCompanySummaryTab } from '../../hooks/useCompanySummaryTab';

export default function CompanySummaryTab() {
  const {
    handleCancel,
    handleChange,
    handleGenerateAI,
    handleSave,
    hasChanges,
    isGenerating,
    isSaving,
    summary,
  } = useCompanySummaryTab();

  return (
    <div className="relative flex w-full max-w-4xl flex-col gap-6">
      <section className="border-border-dark-gray flex flex-col gap-6 rounded-xl border bg-white/2 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-component-default flex size-10 items-center justify-center rounded-lg shadow-sm">
              <Building2 className="text-text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-body-l text-text-white font-semibold">Resumo da Empresa</h3>
              <p className="text-body-s text-text-gray">
                Informações que a IA utiliza para entender o seu negócio
              </p>
            </div>
          </div>

          <Button
            disabled={isGenerating}
            onClick={() => void handleGenerateAI()}
            size="small"
            type="button"
            variant="neutral"
          >
            <Sparkles className="text-brand mr-2" size={16} />
            {isGenerating ? 'Gerando...' : 'Gerar com IA'}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-body-s text-text-gray font-medium" htmlFor="summary-input">
            Descrição do negócio
          </label>
          <textarea
            className="border-border-dark-gray text-text-white placeholder:text-text-gray focus:border-text-gray min-h-[200px] w-full resize-y rounded-lg border bg-black/20 p-4 text-sm transition-all outline-none focus:bg-black/30"
            id="summary-input"
            onChange={handleChange}
            placeholder="Descreva sua empresa aqui..."
            value={summary}
          />
        </div>
      </section>

      {/* Unsaved Changes Footer */}
      <AnimatePresence>
        {hasChanges ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="border-border-dark-gray bg-component-default fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border p-2 shadow-2xl"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pl-4">
              <span className="text-body-s text-text-white font-medium">
                Você tem alterações não salvas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleCancel} size="small" type="button" variant="neutral">
                Descartar
              </Button>
              <Button
                disabled={isSaving}
                onClick={() => void handleSave()}
                size="small"
                type="button"
                variant="primary"
              >
                {isSaving ? 'Salvando...' : 'Salvar Resumo'}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

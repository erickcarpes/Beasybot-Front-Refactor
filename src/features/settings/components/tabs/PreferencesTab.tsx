import { AnimatePresence, motion } from 'framer-motion';
import { Settings } from 'lucide-react';

import Button from '@/components/ui/Button';
import { ONBOARDING_CONFIG } from '@/features/onboarding';
import { cn } from '@/utils/cn';

import { usePreferencesTab } from '../../hooks/usePreferencesTab';

export default function PreferencesTab() {
  const { handleCancel, handleSave, handleSelect, hasChanges, isSaving, preferences } =
    usePreferencesTab();

  const renderOptionGroup = (
    title: string,
    field: keyof typeof preferences,
    options: readonly { label: string; value: string }[],
  ) => (
    <div className="flex flex-col gap-3">
      <span className="text-body-s text-text-white font-medium">{title}</span>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = preferences[field] === option.value;
          return (
            <button
              className={cn(
                'border-border-dark-gray text-body-s rounded-xl border px-5 py-3 transition-all duration-200 hover:cursor-pointer',
                isSelected
                  ? 'border-brand text-brand bg-brand/10 shadow-[0_0_12px_rgba(25,208,95,0.15)]'
                  : 'text-text-gray hover:border-brand/50 hover:text-text-white',
              )}
              key={option.value}
              onClick={() => {
                handleSelect(field, option.value);
              }}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative flex w-full max-w-4xl flex-col gap-6">
      <section className="border-border-dark-gray flex flex-col gap-8 rounded-xl border bg-white/2 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-component-default flex size-10 items-center justify-center rounded-lg shadow-sm">
            <Settings className="text-text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-body-l text-text-white font-semibold">Preferências da Conta</h3>
            <p className="text-body-s text-text-gray">
              Personalize como o sistema deve interagir com você
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {renderOptionGroup(
            'Foco principal de uso',
            'usageFocus',
            ONBOARDING_CONFIG.step1.options ?? [],
          )}
          {renderOptionGroup(
            'Segmento da empresa',
            'businessSegment',
            ONBOARDING_CONFIG.step3.options ?? [],
          )}
          {renderOptionGroup(
            'Seu cargo na empresa',
            'jobRole',
            ONBOARDING_CONFIG.step4.options ?? [],
          )}
          {renderOptionGroup(
            'Tom de voz preferível',
            'preferredTone',
            ONBOARDING_CONFIG.step5.options ?? [],
          )}
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
                {isSaving ? 'Salvando...' : 'Salvar Preferências'}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

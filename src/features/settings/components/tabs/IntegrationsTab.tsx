import { AlertCircle, MessageCircle } from 'lucide-react';

import Button from '@/components/ui/Button';
import { useCurrentUser } from '@/contexts/user/userContext';

import { useWhatsAppIntegration } from '../../hooks/useWhatsAppIntegration';
import WhatsAppIntegrationModal from '../WhatsAppIntegrationModal';

export default function IntegrationsTab() {
  const user = useCurrentUser();

  const {
    code,
    handleIntegrateWhatsApp,
    handleSendPhone,
    handleValidateCode,
    isValidating,
    isVerifying,
    isWhatsAppModalOpen,
    phone,
    setCode,
    setIsWhatsAppModalOpen,
    setPhone,
    step,
  } = useWhatsAppIntegration();

  return (
    <div className="relative flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-body-l text-text-white font-semibold">Integrações Disponíveis</h3>
        <p className="text-body-s text-text-gray">
          Conecte ferramentas externas para potencializar a sua experiência
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp Integration */}
        <section className="border-border-dark-gray flex flex-col gap-4 rounded-xl border bg-white/2 p-6 transition-colors hover:bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#25D366]/20 shadow-sm">
              <MessageCircle className="text-[#25D366]" size={24} />
            </div>
            {user.phone ? (
              <span className="bg-brand/20 text-brand rounded-full px-2 py-0.5 text-xs font-medium">
                Conectado
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-body-m text-text-white font-semibold">WhatsApp</h4>
            <p className="text-body-s text-text-gray min-h-[40px]">
              Receba notificações, resumos e interaja com a IA diretamente pelo seu WhatsApp.
            </p>
          </div>

          <div className="mt-auto pt-4">
            {user.phone ? (
              <div className="border-border-dark-gray text-text-gray flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-black/20 px-3 text-sm opacity-70">
                <span>{user.phone}</span>
                <AlertCircle className="text-brand opacity-80" size={14} />
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  handleIntegrateWhatsApp();
                }}
                size="small"
                type="button"
                variant="neutral"
              >
                Conectar WhatsApp
              </Button>
            )}
          </div>
        </section>

        {/* Google Drive Integration */}
        <section className="border-border-dark-gray flex flex-col gap-4 rounded-xl border bg-white/2 p-6 opacity-70 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/20 shadow-sm">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.01 2.502c-1.127 0-2.196.59-2.766 1.579L2.831 15.197A3.203 3.203 0 0 0 5.584 20h12.832a3.197 3.197 0 0 0 2.76-1.583l6.417-11.116a3.196 3.196 0 0 0-.007-3.194 3.192 3.192 0 0 0-2.762-1.605H12.01zm0 2.148h12.812a1.056 1.056 0 0 1 .915.528 1.06 1.06 0 0 1 .003 1.057l-6.417 11.115-6.412-11.115A1.055 1.055 0 0 1 12.01 4.65zm-7.337 2.14 6.413 11.115H5.584a1.065 1.065 0 0 1-.92-1.59l6.413-11.115a1.064 1.064 0 0 1 .91-.525z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/50">
              Em breve
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-body-m text-text-white font-semibold">Google Drive</h4>
            <p className="text-body-s text-text-gray min-h-[40px]">
              Sincronize seus arquivos e pastas diretamente para a base de conhecimento da IA.
            </p>
          </div>

          <div className="mt-auto pt-4">
            <Button
              className="w-full opacity-50"
              disabled
              size="small"
              type="button"
              variant="neutral"
            >
              Conectar Google Drive
            </Button>
          </div>
        </section>
      </div>

      <WhatsAppIntegrationModal
        code={code}
        handleSendPhone={handleSendPhone}
        handleValidateCode={handleValidateCode}
        isValidating={isValidating}
        isVerifying={isVerifying}
        isWhatsAppModalOpen={isWhatsAppModalOpen}
        phone={phone}
        setCode={setCode}
        setIsWhatsAppModalOpen={setIsWhatsAppModalOpen}
        setPhone={setPhone}
        step={step}
      />
    </div>
  );
}

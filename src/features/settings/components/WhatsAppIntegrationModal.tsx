import Button from '@/components/ui/Button';

interface WhatsAppIntegrationModalProps {
  readonly code: string;
  readonly handleSendPhone: () => Promise<void>;
  readonly handleValidateCode: () => Promise<void>;
  readonly isValidating: boolean;
  readonly isVerifying: boolean;
  readonly isWhatsAppModalOpen: boolean;
  readonly phone: string;
  readonly setCode: (code: string) => void;
  readonly setIsWhatsAppModalOpen: (isOpen: boolean) => void;
  readonly setPhone: (phone: string) => void;
  readonly step: 'CODE' | 'PHONE';
}

export default function WhatsAppIntegrationModal({
  code,
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
}: WhatsAppIntegrationModalProps) {
  if (!isWhatsAppModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!isVerifying && !isValidating) setIsWhatsAppModalOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !isVerifying && !isValidating) {
            setIsWhatsAppModalOpen(false);
          }
        }}
        role="button"
        tabIndex={0}
      />
      <div className="bg-component-default border-border-dark-gray relative z-10 w-full max-w-sm rounded-xl border p-6 shadow-2xl">
        {step === 'PHONE' ? (
          <div className="flex flex-col gap-4">
            <h4 className="text-heading-xs text-text-white font-bold">Conectar WhatsApp</h4>
            <p className="text-body-s text-text-gray">
              Insira seu número de telefone com DDD para receber o código de verificação.
            </p>
            <input
              className="border-border-dark-gray text-text-white placeholder:text-text-gray focus:border-text-gray h-10 w-full rounded-lg border bg-black/20 px-3 text-sm transition-all outline-none focus:bg-black/30"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="+55 (11) 99999-9999"
              type="text"
              value={phone}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                disabled={isVerifying}
                onClick={() => {
                  setIsWhatsAppModalOpen(false);
                }}
                size="small"
                type="button"
                variant="neutral"
              >
                Cancelar
              </Button>
              <Button
                disabled={isVerifying || !phone}
                onClick={() => {
                  void handleSendPhone();
                }}
                size="small"
                type="button"
                variant="primary"
              >
                {isVerifying ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h4 className="text-heading-xs text-text-white font-bold">Verificar Código</h4>
            <p className="text-body-s text-text-gray">
              Insira o código de 4 dígitos que enviamos para o número {phone}.
            </p>
            <input
              className="border-border-dark-gray text-text-white placeholder:text-text-gray focus:border-text-gray h-10 w-full rounded-lg border bg-black/20 px-3 text-center text-lg tracking-widest transition-all outline-none focus:bg-black/30"
              maxLength={4}
              onChange={(e) => {
                setCode(e.target.value.replaceAll(/\D/g, ''));
              }}
              placeholder="0000"
              type="text"
              value={code}
            />
            <div className="mt-2 flex items-center justify-between">
              <button
                className="text-body-xs text-text-gray hover:text-text-white transition-colors hover:underline"
                disabled={isVerifying || isValidating}
                onClick={() => {
                  void handleSendPhone();
                }}
                type="button"
              >
                Reenviar código
              </button>
              <div className="flex items-center gap-2">
                <Button
                  disabled={isValidating}
                  onClick={() => {
                    setIsWhatsAppModalOpen(false);
                  }}
                  size="small"
                  type="button"
                  variant="neutral"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isValidating || code.length !== 4}
                  onClick={() => {
                    void handleValidateCode();
                  }}
                  size="small"
                  type="button"
                  variant="primary"
                >
                  {isValidating ? 'Validando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

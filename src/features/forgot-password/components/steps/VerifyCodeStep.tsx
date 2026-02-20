import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import OtpInput from '@/components/ui/OtpInput';

interface VerifyCodeForm {
  code: string;
}

interface VerifyCodeStepProps {
  readonly email: string;
  readonly isLoading: boolean;
  readonly isResending: boolean;
  readonly onNext: (code: string) => Promise<void>;
  readonly onResend: () => Promise<void>;
}

export default function VerifyCodeStep({
  email,
  isLoading,
  onNext,
  onResend,
}: VerifyCodeStepProps) {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<VerifyCodeForm>({
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<VerifyCodeForm> = async (data) => {
    await onNext(data.code);
  };

  return (
    <>
      <Modal.Title>Verificar código</Modal.Title>
      <Modal.Description>
        Digite o código enviado para <span className="text-brand font-semibold">{email}</span>.
      </Modal.Description>

      <form
        className="gap-m flex w-full flex-col items-center"
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <OtpInput length={4} onChange={onChange} value={value} />
          )}
          rules={{
            minLength: {
              message: 'O código deve ter 4 dígitos',
              value: 4,
            },
            required: 'Código é obrigatório',
          }}
        />

        <Modal.Actions>
          <Button disabled={!isValid || isLoading} size="full" type="submit" variant="primary">
            {isLoading ? 'Verificando...' : 'Confirmar'}
          </Button>
        </Modal.Actions>
      </form>

      <div className="mt-l flex w-full justify-center">
        <span className="text-text-secondary text-body-s">
          Não encontrou o código?{' '}
          <button
            className="text-brand hover:cursor-pointer hover:underline"
            onClick={() => void onResend()}
            type="button"
          >
            Reenviar
          </button>
        </span>
      </div>
    </>
  );
}

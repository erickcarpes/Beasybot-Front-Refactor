import { type SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';

interface RequestResetForm {
  email: string;
}

interface RequestResetStepProps {
  readonly isLoading: boolean;
  readonly onNext: (email: string) => Promise<void>;
}

export default function RequestResetStep({ isLoading, onNext }: RequestResetStepProps) {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<RequestResetForm>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<RequestResetForm> = async (data) => {
    await onNext(data.email);
  };

  return (
    <>
      <Modal.Title>Redefinição de senha</Modal.Title>
      <Modal.Description>
        Insira seu e-mail abaixo e lhe enviaremos um código para redefinição de senha.
      </Modal.Description>

      <form className="gap-m flex w-full flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <InputLabel
          error={errors.email?.message}
          id="email"
          label="Email"
          placeholder="Ex.: joão@gmail.com"
          type="email"
          {...register('email', {
            required: 'Email é obrigatório',
          })}
        />

        <Modal.Actions>
          <Button disabled={!isValid || isLoading} size="full" type="submit" variant="primary">
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </Button>
        </Modal.Actions>
      </form>

      <div className="mt-l flex w-full justify-center">
        <span className="text-text-secondary text-body-s">
          Ainda não tem uma conta?{' '}
          <a className="text-brand hover:underline" href="/signup">
            Faça a sua aqui
          </a>
        </span>
      </div>
    </>
  );
}

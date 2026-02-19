import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/Button';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';
import { createRequirements, passwordChecks } from '@/utils/formHelpers';

interface NewPasswordStepProps {
  readonly isLoading: boolean;
  readonly onNext: (password: string) => Promise<void>;
}

const schema = z
  .object({
    confirmPassword: z.string(),
    password: z.string().superRefine((value, context) => {
      for (const check of passwordChecks) {
        if (!check.rule.safeParse(value).success) {
          context.addIssue({
            code: 'custom',
            message: check.label,
          });
        }
      }
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type NewPasswordForm = z.infer<typeof schema>;

export default function NewPasswordStep({ isLoading, onNext }: NewPasswordStepProps) {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch,
  } = useForm<NewPasswordForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const password = watch('password');
  const requirements = createRequirements(password, passwordChecks);

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    await onNext(data.password);
  };

  return (
    <>
      <Modal.Title>Nova senha</Modal.Title>
      <Modal.Description>Crie uma nova senha para a sua conta</Modal.Description>

      <form className="gap-m flex w-full flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <InputLabel
          id="password"
          label="Nova Senha"
          placeholder="••••••••••••••••"
          requirements={requirements}
          type="password"
          variant={errors.password?.message ? 'error' : 'default'}
          {...register('password')}
        />

        <InputLabel
          error={errors.confirmPassword?.message}
          id="confirmPassword"
          label="Confirmar Senha"
          placeholder="••••••••••••••••"
          type="password"
          variant={errors.confirmPassword?.message ? 'error' : 'default'}
          {...register('confirmPassword')}
        />

        <Modal.Actions>
          <Button disabled={!isValid || isLoading} size="full" type="submit" variant="primary">
            {isLoading ? 'Confirmando...' : 'Confirmar'}
          </Button>
        </Modal.Actions>
      </form>
    </>
  );
}

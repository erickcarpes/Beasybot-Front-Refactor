import { type SyntheticEvent, useCallback } from 'react';

import Button from '@/components/ui/Button';
import InputLabel from '@/components/ui/InputLabel';

import { useLoginFlow } from '../hooks/useLoginFlow';
import LoginFooter from './LoginFooter';
import LoginHeader from './LoginHeader';

export default function LoginForm() {
  const { errors, handleSubmit, isPending, isValid, onSubmit, register } = useLoginFlow();

  const handleFormSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      void handleSubmit(onSubmit)(event);
    },
    [handleSubmit, onSubmit],
  );

  return (
    <main className="text-text-white px-xl component-gradient border-border-dark-gray flex w-full max-w-120 flex-col items-start rounded-xl border py-12">
      <LoginHeader />

      <form className="px-s w-full" onSubmit={handleFormSubmit}>
        <InputLabel
          error={errors.email?.message}
          id="email"
          label="Email"
          placeholder="Ex.:joão@gmail.com"
          type="email"
          {...register('email')}
        />

        <InputLabel
          error={errors.password?.message}
          id="password"
          label="Senha"
          labelAction={
            <button className="text-brand text-body-s cursor-pointer hover:underline" type="button">
              Esqueceu a senha?
            </button>
          }
          placeholder="••••••••••••••••"
          type="password"
          {...register('password')}
        />

        <Button
          className="mt-m"
          disabled={!isValid || isPending}
          size="full"
          type="submit"
          variant="primary"
        >
          {isPending ? 'Entrando...' : 'Login'}
        </Button>
      </form>

      <LoginFooter />
    </main>
  );
}

import { type MouseEvent, type SyntheticEvent, useCallback, useState } from 'react';

import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import InputLabel from '@/components/ui/InputLabel';

import type { SignupFormData } from '../hooks/useSignupForm';

import { useSignupFlow } from '../hooks/useSignupFlow';
import SignupFooter from './SignupFooter';
import SignupHeader from './SignupHeader';
import TermsModal from './TermsModal';

interface SignupField {
  key: Exclude<keyof SignupFormData, 'terms'>;
  label: string;
  placeholder: string;
  type?: string;
}

const fields: SignupField[] = [
  { key: 'name', label: 'Nome de usuário (opcional)', placeholder: 'Digite seu nome' },
  { key: 'email', label: 'Email', placeholder: 'mail@empresa.com', type: 'email' },
  { key: 'password', label: 'Crie a senha', placeholder: 'Senha forte', type: 'password' },
  { key: 'inviteCode', label: 'Código de convite', placeholder: 'PIN exclusivo' },
];

export default function SignupForm() {
  const { errors, handleSubmit, isPending, isValid, onSubmit, register, requirements, setValue } =
    useSignupFlow();
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const handleFormSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      void handleSubmit(onSubmit)(event);
    },
    [handleSubmit, onSubmit],
  );

  const handleTermsAccept = useCallback(() => {
    setValue('terms', true, { shouldValidate: true });
    setHasReadTerms(true);
  }, [setValue]);

  const handleOpenTerms = useCallback(() => {
    setTermsOpen(true);
  }, []);

  const handleCloseTerms = useCallback(() => {
    setTermsOpen(false);
  }, []);

  const handleCheckboxClick = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      if (!hasReadTerms) {
        event.preventDefault();
        setTermsOpen(true);
      }
    },
    [hasReadTerms],
  );

  return (
    <main className="text-text-white px-xl component-gradient border-border-dark-gray flex w-full max-w-120 flex-col items-start rounded-xl border py-12">
      <SignupHeader />

      <form className="px-s w-full" onSubmit={handleFormSubmit}>
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <InputLabel
              error={key === 'password' ? undefined : errors[key]?.message}
              id={key}
              label={label}
              placeholder={placeholder}
              requirements={key === 'password' ? requirements : undefined}
              type={type ?? 'text'}
              {...register(key)}
            />
          </div>
        ))}

        <Checkbox
          className="cursor-pointer"
          error={errors.terms?.message}
          id="terms"
          label={
            <>
              Eu concordo com os{' '}
              <button
                className="text-brand cursor-pointer hover:underline"
                onClick={handleOpenTerms}
                type="button"
              >
                termos e privacidade
              </button>
            </>
          }
          onClick={handleCheckboxClick}
          wrapperClassName="mb-l cursor-pointer"
          {...register('terms')}
        />

        <Button disabled={!isValid || isPending} size="full" type="submit" variant="primary">
          {isPending ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>

      <TermsModal isOpen={isTermsOpen} onAccept={handleTermsAccept} onClose={handleCloseTerms} />

      <SignupFooter />
    </main>
  );
}

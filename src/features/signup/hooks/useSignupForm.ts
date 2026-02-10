import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { createRequirements, passwordChecks } from '@/utils/formHelpers';

const schema = z.object({
  email: z.email('Email inválido'),
  inviteCode: z.string().min(1, 'Código de convite obrigatório'),
  name: z.string().optional(),
  password: z.string().superRefine((password, context) => {
    for (const check of passwordChecks) {
      if (!check.rule.safeParse(password).success) {
        context.addIssue({
          code: 'custom',
          message: check.label,
        });
      }
    }
  }),
  terms: z.boolean().refine((value) => value, {
    message: 'Você deve aceitar os termos e privacidade',
  }),
});

export type SignupFormData = z.infer<typeof schema>;

export const useSignupForm = () => {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<SignupFormData>({
    defaultValues: {
      email: '',
      inviteCode: '',
      name: '',
      password: '',
      terms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const requirements = createRequirements(watch('password'), passwordChecks);
  const termsAccepted = watch('terms');

  return {
    errors,
    handleSubmit,
    isValid,
    register,
    requirements,
    setError,
    setValue,
    termsAccepted,
    trigger,
  };
};

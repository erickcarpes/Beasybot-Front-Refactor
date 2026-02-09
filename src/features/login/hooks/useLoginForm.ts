import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type LoginFormData = z.infer<typeof schema>;

export const useLoginForm = () => {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    errors,
    handleSubmit,
    isValid,
    register,
    setError,
  };
};

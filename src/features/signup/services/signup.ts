import { useMutation } from '@tanstack/react-query';

import api from '@/services/beasybox-api/api';

export interface SignupRequest {
  email: string;
  inviteCode: string;
  name?: string;
  password: string;
}

export const useSignupFormService = () => {
  return useMutation<unknown, unknown, SignupRequest>({
    mutationFn: async (data) => {
      await api.post('/auth/signup', data);
    },
  });
};

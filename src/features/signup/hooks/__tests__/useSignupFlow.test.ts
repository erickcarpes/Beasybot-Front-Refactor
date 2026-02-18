import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useSignupFlow } from '../useSignupFlow';

const useSignupFormMock = vi.fn();
const useSignupFormServiceMock = vi.fn();
const showToast = vi.fn();
let mutateAsync = vi.fn();

vi.mock('@/features/signup/hooks/useSignupForm', () => ({
  useSignupForm: () => useSignupFormMock(),
}));

vi.mock('@/features/signup/services/signup', () => ({
  useSignupFormService: () => useSignupFormServiceMock(),
}));

vi.mock('@/contexts/toastContext', () => ({
  useToast: () => ({
    showToast,
  }),
}));

const createFormReturn = () => ({
  errors: {},
  handleSubmit: vi.fn(),
  isValid: true,
  register: vi.fn(),
  requirements: null,
  setValue: vi.fn(),
});

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  mutateAsync = vi.fn();
  useSignupFormMock.mockReturnValue(createFormReturn());
  useSignupFormServiceMock.mockReturnValue({ isPending: false, mutateAsync });
});

describe('useSignupFlow', () => {
  const payload = {
    email: 'teste@beasybox.com',
    inviteCode: 'PIN-123',
    name: 'Test User',
    password: 'Password123!',
  };

  test('shows success toast when signup completes', async () => {
    mutateAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() => useSignupFlow());

    await act(async () => {
      await result.current.onSubmit(payload);
    });

    expect(mutateAsync).toHaveBeenCalledWith(payload);
    expect(showToast).toHaveBeenCalledWith('Conta criada! Verifique seu e-mail.', 'success');
  });

  test('shows error toast when signup fails', async () => {
    mutateAsync.mockRejectedValue(new Error('falha'));

    const { result } = renderHook(() => useSignupFlow());

    await act(async () => {
      await result.current.onSubmit(payload);
    });

    expect(mutateAsync).toHaveBeenCalledWith(payload);
    expect(showToast).toHaveBeenCalledWith('Não foi possível criar a conta.', 'error');
  });
});

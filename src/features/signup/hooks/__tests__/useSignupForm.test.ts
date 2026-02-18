import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { useSignupForm } from '../useSignupForm';

const VALID_PASSWORD = 'Str0ng!Pass';

const fillValidData = (setValue: ReturnType<typeof useSignupForm>['setValue']) => {
  act(() => {
    setValue('email', 'teste@beasybox.com');
    setValue('inviteCode', 'PIN-123');
    setValue('password', VALID_PASSWORD);
    setValue('terms', true);
  });
};

describe('useSignupForm', () => {
  test('starts invalid and reports password rules when value is insufficient', async () => {
    const { result } = renderHook(() => useSignupForm());
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setValue('password', 'short');
    });

    await act(async () => {
      await result.current.trigger('password');
    });

    expect(result.current.errors.password?.message).toBe('8 caracteres');
  });

  test('considers the form valid after all fields meet the schema', async () => {
    const { result } = renderHook(() => useSignupForm());

    fillValidData(result.current.setValue);

    await act(async () => {
      await result.current.trigger();
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.inviteCode).toBeUndefined();
    expect(result.current.errors.password).toBeUndefined();
    expect(result.current.errors.terms).toBeUndefined();
    expect(result.current.isValid).toBe(true);
  });

  test('keeps track of the terms checkbox state', () => {
    const { result } = renderHook(() => useSignupForm());

    expect(result.current.termsAccepted).toBe(false);

    act(() => {
      result.current.setValue('terms', true);
    });

    expect(result.current.termsAccepted).toBe(true);
  });
});

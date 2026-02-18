import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import SignupForm from '../SignupForm';

const useSignupFlowMock = vi.fn();

function TermsModalMock({ isOpen, onAccept, onClose }: any) {
  return (
    <div>
      {isOpen && (
        <div data-testid="terms-modal">
          <button data-testid="accept-button" onClick={onAccept}>
            Aceitar
          </button>
          <button data-testid="close-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

vi.mock('@/features/signup/hooks/useSignupFlow', () => ({
  useSignupFlow: () => useSignupFlowMock(),
}));

vi.mock('@/features/signup/components/TermsModal', () => ({
  default: TermsModalMock,
}));

const createFlow = (overrides = {}) => ({
  errors: {},
  handleSubmit: vi.fn((callback) => (event) => {
    event?.preventDefault?.();
    callback({
      email: 'teste@beasybox.com',
      inviteCode: 'PIN-123',
      name: 'Test',
      password: 'Pass123!',
      terms: true,
    });
  }),
  isPending: false,
  isValid: true,
  onSubmit: vi.fn(),
  register: (name: string) => ({
    name,
    onBlur: () => {},
    onChange: () => {},
    ref: () => null,
  }),
  requirements: <div data-testid="requirements">Requisitos</div>,
  setValue: vi.fn(),
  ...overrides,
});

const mountForm = (flowOverrides = {}) => {
  const flow = createFlow(flowOverrides);
  useSignupFlowMock.mockReturnValue(flow);
  const utils = render(<SignupForm />);
  return { ...utils, flow };
};

describe('SignupForm', () => {
  test('toggles submission button states based on form validity', async () => {
    const { rerender } = mountForm({ isPending: false, isValid: false });
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeDisabled();

    useSignupFlowMock.mockReturnValue(createFlow({ isPending: true, isValid: true }));
    rerender(<SignupForm />);
    expect(screen.getByRole('button', { name: /criando/i })).toBeDisabled();

    useSignupFlowMock.mockReturnValue(createFlow({ isPending: false, isValid: true }));
    rerender(<SignupForm />);
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeEnabled();
  });

  test('renders validation errors', () => {
    mountForm({ errors: { email: { message: 'Email inv�lido' } } });
    expect(screen.getByText(/Email inv�lido/i)).toBeInTheDocument();
  });

  test('opens the terms modal and accepts terms', async () => {
    const user = userEvent.setup();
    const { flow } = mountForm({ isValid: true });

    await user.click(screen.getByRole('button', { name: /termos e privacidade/i }));

    expect(screen.getByTestId('terms-modal')).toBeInTheDocument();

    await user.click(screen.getByTestId('accept-button'));

    expect(flow.setValue).toHaveBeenCalledWith('terms', true, { shouldValidate: true });
  });

  test('calls onSubmit when the form is submitted and valid', async () => {
    const user = userEvent.setup();
    const { flow } = mountForm({ isPending: false, isValid: true });

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(flow.onSubmit).toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@/features/signup', () => ({
  SignupForm: () => <div data-testid="signup-form" />,
}));

import SignupPage from '../SignupPage';

describe('SignupPage', () => {
  test('renders the signup layout with animation and form', () => {
    render(<SignupPage />);

    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.getByTestId('lottie')).toBeInTheDocument();
  });
});

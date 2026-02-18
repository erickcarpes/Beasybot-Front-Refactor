import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import SignupFooter from '../SignupFooter';

describe('SignupFooter', () => {
  test('renders login link', () => {
    render(<SignupFooter />);

    const link = screen.getByRole('link', { name: /faça login/i });
    expect(link).toHaveAttribute('href', '/login');
  });
});

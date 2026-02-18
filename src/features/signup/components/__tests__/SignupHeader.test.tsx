import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import SignupHeader from '../SignupHeader';

describe('SignupHeader', () => {
  test('renders the logo and heading', () => {
    render(<SignupHeader />);

    expect(screen.getByRole('img', { name: /logo da beasybox/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /vamos começar\?/i })).toBeInTheDocument();
  });
});

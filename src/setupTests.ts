import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode; to?: string }) => (
    <a {...props} href={typeof to === 'string' ? to : undefined}>
      {children}
    </a>
  ),
}));

vi.mock('lottie-react', () => ({
  default: (props: React.ComponentProps<'div'>) => <div data-testid="lottie" {...props} />,
}));

const createMotionComponent = (tag: keyof JSX.IntrinsicElements) =>
  React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) =>
    React.createElement(tag, { ...props, ref }),
  );

const motionMock = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (typeof prop !== 'string') {
        return createMotionComponent('div');
      }
      return createMotionComponent(prop as keyof JSX.IntrinsicElements);
    },
  },
);

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: motionMock,
}));

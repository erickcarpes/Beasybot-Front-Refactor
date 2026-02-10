import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface ModalActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalActions = forwardRef<HTMLDivElement, ModalActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('inline-flex items-center justify-center gap-4 self-stretch', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ModalActions.displayName = 'Modal.Actions';

export default ModalActions;

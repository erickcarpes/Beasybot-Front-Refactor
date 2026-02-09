import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../utils/cn';

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className={cn('flex items-center justify-center', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

ModalContent.displayName = 'Modal.Content';

export default ModalContent;

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../utils/cn';

interface ModalDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalDescription = forwardRef<HTMLDivElement, ModalDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'text-text-white mb-l flex-1 justify-center self-stretch text-center text-base leading-normal font-normal tracking-wide',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ModalDescription.displayName = 'Modal.Description';

export default ModalDescription;

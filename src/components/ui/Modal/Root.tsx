import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface ModalRootProps extends HTMLAttributes<HTMLDivElement> {
  backdropClassName?: string;
  children: ReactNode;
  disabledBackdrop?: boolean;
}

const ModalRoot = forwardRef<HTMLDivElement, ModalRootProps>(
  ({ backdropClassName, children, className, disabledBackdrop = false, ...props }, ref) => {
    return (
      <div
        className={
          disabledBackdrop
            ? ''
            : cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
                backdropClassName,
              )
        }
      >
        <div
          className={cn(
            'bg-components border-stroke-3 px-xl pt-l inline-flex min-h-52 w-[464px] flex-col items-center justify-start rounded-xl border pb-12',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

ModalRoot.displayName = 'Modal.Root';

export default ModalRoot;

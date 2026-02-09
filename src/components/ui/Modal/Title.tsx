import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../utils/cn';

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  onClose?: () => void;
  visible?: boolean;
}

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, className, onClose, visible = false, ...props }, ref) => {
    return (
      <>
        <div className="h-l flex w-full items-center justify-end">
          {visible && <X className="cursor-pointer" onClick={onClose} />}
        </div>

        <h2
          className={cn(
            `mb-xl justify-center text-center text-2xl leading-relaxed font-bold tracking-wide text-white`,
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </h2>
      </>
    );
  },
);

ModalTitle.displayName = 'Modal.Title';

export default ModalTitle;

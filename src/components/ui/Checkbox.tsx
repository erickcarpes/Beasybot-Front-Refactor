import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  error?: string;
  label?: ReactNode;
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, id, label, wrapperClassName, ...props }, ref) => {
    const inputId = id ?? 'checkbox';

    return (
      <div className={cn('w-full', wrapperClassName)}>
        <div className="flex items-center gap-3">
          <input
            className={cn(
              'text-brand focus:ring-brand h-4 w-4 cursor-pointer rounded-[6px] border border-(--color-border) bg-transparent transition-colors',
              className,
            )}
            id={inputId}
            ref={ref}
            type="checkbox"
            {...props}
          />
          {label && (
            <div className="text-sm leading-none text-(--color-text-muted)">
              <label className="cursor-pointer" htmlFor={inputId}>
                {label}
              </label>
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs text-(--color-error)"
              exit={{ opacity: 0, y: -5 }}
              initial={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

export interface InputProps
  extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  'px-m py-xs h-10 flex text-body-s text-text-gray placeholder:text-text-gray focus:text-text-white focus:placeholder:text-text-white justify-center border-1 items-center rounded-default hover:cursor-pointer gap-xs transition-colors duration-200 ease-in-out focus:cursor-text',
  {
    defaultVariants: {
      isDisabled: false,
      size: 'full',
      variant: 'default',
    },
    variants: {
      isDisabled: {
        true: '[background:transparent] disabled:cursor-not-allowed disabled:border-border-dark-gray-2 disabled:shadow-none disabled:text-border-dark-gray-2 disabled:placeholder:text-border-dark-gray-2',
      },
      size: {
        full: 'w-full',
        small: 'w-101',
      },
      variant: {
        default: 'border-border-gray focus:border-text-white',
        error: 'border-error',
      },
    },
  },
);

export default function Input({ className, size, variant, ...props }: Readonly<InputProps>) {
  return (
    <input
      className={cn(inputVariants({ isDisabled: props.disabled, size, variant }), className)}
      {...props}
    ></input>
  );
}

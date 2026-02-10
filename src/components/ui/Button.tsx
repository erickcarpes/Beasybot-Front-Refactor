import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps, type ElementType } from 'react';

import { cn } from '@/utils/cn';

export interface ButtonProps
  extends ComponentProps<'button'>, Omit<ButtonVariantProps, 'size' | 'variant'> {
  icon?: ElementType;
  size: ButtonVariantProps['size'];
  variant: ButtonVariantProps['variant'];
}

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  'p-2 h-10 flex justify-center items-center rounded-default hover:cursor-pointer gap-xs transition-colors duration-200 ease-in-out',
  {
    defaultVariants: {
      isDisabled: false,
    },
    variants: {
      isDisabled: {
        true: '[background:transparent] disabled:cursor-not-allowed border-1 disabled:border-border-dark-gray disabled:shadow-none',
      },
      size: {
        full: 'w-full text-body-m',
        icon: 'w-5 h-5 p-0 rounded-m',
        medium: 'min-w-45 w-45 text-body-m',
        small: 'min-w-30 w-30 h-9 text-body-s',
      },
      variant: {
        destructive: 'button-destructive',
        neutral: 'button-neutral',
        primary: 'button-primary',
      },
    },
  },
);

export default function Button({
  children,
  className,
  icon: Icon,
  size,
  variant,
  ...props
}: Readonly<ButtonProps>) {
  const isIconOnly = !children && Icon;
  return (
    <button
      className={cn(buttonVariants({ isDisabled: props.disabled, size, variant }), className)}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {!isIconOnly && children}
    </button>
  );
}

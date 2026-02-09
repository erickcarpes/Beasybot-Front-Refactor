import { type FocusEvent, type ReactNode, useId, useState } from 'react';

import Input, { type InputProps } from './Input';

interface InputLabelProps extends InputProps {
  error?: string;
  label: string;
  labelAction?: ReactNode;
  requirements?: ReactNode;
}

export default function InputLabel({
  error,
  label,
  labelAction,
  requirements,
  ...props
}: Readonly<InputLabelProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="gap-xs mb-xs text-body-s px-s flex h-[21px] items-center justify-between">
        <label className="flex min-w-0 flex-1 items-center" htmlFor={id}>
          <span className="text-text-white truncate">{label}</span>
        </label>
        {labelAction}
      </div>

      <Input {...props} id={id} onBlur={handleBlur} onFocus={handleFocus} />

      <div className="px-s text-body-xs mt-xxs flex min-h-4.5 items-center">
        {requirements && isFocused
          ? requirements
          : error && <span className="text-error">{error}</span>}
      </div>
    </div>
  );
}

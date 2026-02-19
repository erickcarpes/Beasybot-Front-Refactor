import { type ClipboardEvent, type KeyboardEvent, useRef, useState } from 'react';

import { cn } from '@/utils/cn';

interface OtpInputProps {
  readonly length?: number;
  readonly onChange: (value: string) => void;
  readonly value: string;
}

export default function OtpInput({ length = 4, onChange, value }: OtpInputProps) {
  const inputReferences = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<null | number>(null);

  const fillOtp = (text: string) => {
    const cleanText = text.replaceAll(/\D/g, '').slice(0, length);
    onChange(cleanText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1).replaceAll(/\D/g, ''); // Get last char, numbers only
    if (!char) return; // Ignore if empty or non-numeric

    // eslint-disable-next-line
    const newValue = [...value];
    newValue[index] = char;
    const nextValue = newValue.join('').slice(0, length);
    onChange(nextValue);

    if (index < length - 1) {
      inputReferences.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      // eslint-disable-next-line
      const newValue = [...value];

      if (newValue[index]) {
        // Clear current input
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // Move back and clear previous if current is empty
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputReferences.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputReferences.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputReferences.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    fillOtp(pastedData);

    // Focus last filled input
    const cleanText = pastedData.replaceAll(/\D/g, '').slice(0, length);
    const nextIndex = Math.min(cleanText.length - 1, length - 1);
    if (nextIndex >= 0) {
      inputReferences.current[nextIndex]?.focus();
    }
  };

  // Ensure value matches length for rendering
  // Ensure value matches length for rendering
  // eslint-disable-next-line
  const values = [...value.padEnd(length, ' ')];

  return (
    <div className="flex gap-4">
      {values.map((char, index) => (
        <div className="relative h-14 w-10" key={index}>
          <input
            className={cn(
              'border-border-dark-gray bg-component-default text-text-white focus:border-brand absolute inset-0 flex h-full w-full items-center justify-center rounded-lg border text-center text-lg font-semibold transition-colors focus:ring-0 focus:outline-none',
              focusedIndex === index && 'border-brand',
            )}
            maxLength={1}
            onBlur={() => {
              setFocusedIndex(null);
            }}
            onChange={(e) => {
              handleChange(e, index);
            }}
            onFocus={() => {
              setFocusedIndex(index);
            }}
            onKeyDown={(e) => {
              handleKeyDown(e, index);
            }}
            onPaste={handlePaste}
            ref={(element) => {
              inputReferences.current[index] = element;
            }}
            type="text"
            value={char.trim()}
          />
        </div>
      ))}
    </div>
  );
}

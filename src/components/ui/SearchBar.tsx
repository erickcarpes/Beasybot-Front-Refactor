import { Search } from 'lucide-react';
import { type ComponentProps, useEffect, useState } from 'react';

import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface SearchBarProps extends Omit<ComponentProps<typeof Input>, 'onChange' | 'value'> {
  debounceTime?: number;
  onSearch: (value: string) => void;
  value?: string;
}

export default function SearchBar({
  className,
  debounceTime = 300,
  onSearch,
  value = '',
  ...props
}: Readonly<SearchBarProps>) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalValue);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [internalValue, debounceTime, onSearch]);

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="text-text-2 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2" />
      <Input
        className="pl-10"
        onChange={(e) => {
          setInternalValue(e.target.value);
        }}
        placeholder="Buscar..."
        value={internalValue}
        {...props}
      />
    </div>
  );
}

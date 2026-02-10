import { AnimatePresence, motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// Types
// ============================================================================

export interface DropdownItem {
  icon?: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface DropdownMenuProps {
  readonly items: DropdownItem[];
}

// ============================================================================
// Component
// ============================================================================

export default function DropdownMenu({ items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="text-text-2 hover:bg-component-hover hover:text-text-1 rounded-m p-1 transition-colors"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        type="button"
      >
        <MoreVertical size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-component-default border-stroke-2 absolute right-0 z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border p-1 shadow-lg"
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            {items.map((item, index) => (
              <button
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  item.variant === 'destructive'
                    ? 'text-fail-error hover:bg-fail-error/10'
                    : 'text-text-1 hover:bg-component-hover',
                )}
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                type="button"
              >
                {item.icon && <item.icon size={16} />}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

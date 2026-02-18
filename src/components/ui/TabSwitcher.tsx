import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

// ============================================================================
// Types
// ============================================================================

interface TabItem<T extends string> {
  readonly label: string;
  readonly value: T;
}

interface TabSwitcherProps<T extends string> {
  readonly items: readonly TabItem<T>[];
  readonly onChange: (value: T) => void;
  readonly value: T;
}

// ============================================================================
// Component
// ============================================================================

export default function TabSwitcher<T extends string>({
  items,
  onChange,
  value,
}: TabSwitcherProps<T>) {
  return (
    <div className="border-stroke-2 flex gap-0.5 rounded-full border p-0.5">
      {items.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            className={cn(
              'relative z-10 flex-1 cursor-pointer rounded-full px-4 py-1 text-center text-sm font-semibold transition-colors duration-200',
              isActive ? 'text-text-white' : 'text-text-2 hover:text-text-white',
            )}
            key={item.value}
            onClick={() => {
              onChange(item.value);
            }}
            type="button"
          >
            {isActive && (
              <motion.div
                className="bg-green-accent absolute inset-0 rounded-full"
                layoutId="tab-pill"
                transition={{ damping: 30, stiffness: 400, type: 'spring' }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

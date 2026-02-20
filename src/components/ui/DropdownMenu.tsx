import { AnimatePresence, motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ left: 0, top: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { capture: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position the menu relative to the viewport
      setCoords({
        left: rect.right + window.scrollX,
        top: rect.bottom + window.scrollY,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="text-text-2 hover:bg-component-hover hover:text-text-1 rounded-m cursor-pointer p-1 transition-colors"
        onClick={toggleMenu}
        ref={buttonRef}
        type="button"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen &&
        createPortal(
          <div className="pointer-events-none absolute inset-0 z-50">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-component-default border-stroke-2 pointer-events-auto absolute z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border p-1 shadow-lg"
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  ref={menuRef}
                  style={{
                    // calculate left so it anchors to the right of the button
                    left: coords.left - 160,
                    top: coords.top,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  {items.map((item, index) => (
                    <button
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        item.variant === 'destructive'
                          ? 'text-fail-error hover:bg-fail-error/10'
                          : 'text-text-1 hover:bg-component-hover',
                      )}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
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
          </div>,
          document.body,
        )}
    </>
  );
}

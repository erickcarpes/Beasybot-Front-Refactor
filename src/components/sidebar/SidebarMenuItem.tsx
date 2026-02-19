import { useMatchRoute, useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { type ElementType } from 'react';

import { cn } from '@/utils/cn';

import { useSidebar } from './SidebarContext';

// ============================================================================
// Types
// ============================================================================

interface SidebarMenuItemBaseProps {
  /** Label do item */
  readonly label: string;
  /** Rota para navegar ao clicar */
  readonly to: string;
}

type SidebarMenuItemProps = SidebarMenuItemWithComponent | SidebarMenuItemWithImage;

interface SidebarMenuItemWithComponent extends SidebarMenuItemBaseProps {
  /** Ícone como componente (ex: Lucide icon) */
  readonly icon: ElementType;
  readonly iconSrc?: never;
}

interface SidebarMenuItemWithImage extends SidebarMenuItemBaseProps {
  readonly icon?: never;
  /** Ícone como caminho de imagem (ex: SVG importado) */
  readonly iconSrc: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Item individual do menu da sidebar
 *
 * - Ativo (rota atual): borda direita verde
 * - Hover: borda direita cinza
 */
export default function SidebarMenuItem({ icon: Icon, iconSrc, label, to }: SidebarMenuItemProps) {
  const { closeMobile, isExpanded } = useSidebar();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ fuzzy: true, to });

  const handleClick = () => {
    void navigate({ to });
    closeMobile();
  };

  return (
    <button
      className={cn(
        'group rounded-m hover:bg-component-hover/30 flex w-full cursor-pointer items-center gap-3 border-r-2 px-3 py-2 transition-all',
        isActive ? 'border-green-500' : 'hover:border-stroke border-transparent',
      )}
      onClick={handleClick}
      title={isExpanded ? undefined : label}
      type="button"
    >
      {Icon ? (
        <Icon className="size-5 shrink-0" color="white" strokeWidth={1} />
      ) : (
        <img alt={label} className="size-5 shrink-0" src={iconSrc} />
      )}

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.span
            animate={{ opacity: 1, width: 'auto' }}
            className={cn(
              'text-body-s truncate whitespace-nowrap',
              isActive ? 'text-text-white' : 'text-text-1',
            )}
            exit={{ opacity: 0, width: 0 }}
            initial={{ opacity: 0, width: 0 }}
            key="label"
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

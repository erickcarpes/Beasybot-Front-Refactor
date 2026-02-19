import { AnimatePresence, motion } from 'framer-motion';
import { Info, LogOut, Mail, Settings } from 'lucide-react';
import { createPortal } from 'react-dom';

import { useAuth } from '@/contexts/user/userContext';

// ============================================================================
// Types
// ============================================================================

interface DropdownItem {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly onClick: () => void;
  readonly separator?: boolean;
}

interface SidebarUserDropdownProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenSettings: () => void;
  readonly triggerRect: DOMRect | null;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Dropdown menu that appears above the SidebarUser button.
 * Styled to match the ChatGPT sidebar dropdown pattern.
 */
export default function SidebarUserDropdown({
  isOpen,
  onClose,
  onOpenSettings,
  triggerRect,
}: SidebarUserDropdownProps) {
  const { logout } = useAuth();

  const items: DropdownItem[] = [
    {
      icon: Settings,
      label: 'Configurações',
      onClick: () => {
        onOpenSettings();
      },
    },
    {
      icon: Info,
      label: 'Saiba mais',
      onClick: () => {
        globalThis.open('https://buy.beasybox.com.br/beasybox', '_blank');
      },
    },
    {
      icon: Mail,
      label: 'Entre em contato',
      onClick: () => {
        globalThis.open('mailto:contato@beasybox.com', '_blank');
      },
    },
    {
      icon: LogOut,
      label: 'Sair',
      onClick: () => {
        void logout();
      },
      separator: true,
    },
  ];

  // Calculate position based on triggerRect
  // We want it slightly above the trigger (bottom = viewport height - trigger top + gap)
  const bottom = triggerRect ? window.innerHeight - triggerRect.top : 0;
  const left = triggerRect ? triggerRect.left + 16 : 0;
  // Use trigger width but ensure a minimum reasonable width (e.g. 240px)
  // If sidebar is expanded (280px), trigger is ~280px.
  // If sidebar is collapsed (60px), trigger is ~60px.
  // We want to maintain the "popover" look.
  const width = triggerRect ? Math.max(triggerRect.width - 24, 180) : 180;

  return createPortal(
    <AnimatePresence>
      {isOpen && triggerRect ? (
        <div className="fixed inset-0 z-50">
          {/* Transparent Backdrop for click-outside */}
          <div className="absolute inset-0 z-40" onClick={onClose} />

          {/* Dropdown Content */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="border-border-dark-gray bg-component-default fixed z-50 mb-2 overflow-hidden rounded-xl border shadow-lg"
            exit={{ opacity: 0, y: 4 }}
            initial={{ opacity: 0, y: 4 }}
            key="user-dropdown"
            style={{
              bottom,
              left,
              width,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="flex flex-col py-1">
              {items.map((item) => (
                <div key={item.label}>
                  {item.separator ? (
                    <div className="border-border-dark-gray mx-3 my-1 border-t" />
                  ) : null}
                  <button
                    className="hover:bg-component-hover/30 text-text-white text-body-s flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100"
                    onClick={() => {
                      item.onClick();
                    }}
                    type="button"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

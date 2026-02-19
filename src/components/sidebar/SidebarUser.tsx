import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, User } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/contexts/user/userContext';
import { SettingsModal } from '@/features/settings';

import { useSidebar } from './SidebarContext';
import SidebarUserDropdown from './SidebarUserDropdown';

/**
 * Botão do usuário no rodapé da sidebar.
 * Ao clicar, abre/fecha um dropdown com opções (estilo ChatGPT).
 */
export default function SidebarUser() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? user?.email ?? 'Usuário';
  const initials = displayName.charAt(0).toUpperCase();

  const toggleDropdown = useCallback(() => {
    if (!isDropdownOpen && containerRef.current) {
      setTriggerRect(containerRef.current.getBoundingClientRect());
    }
    setIsDropdownOpen((previous) => !previous);
  }, [isDropdownOpen]);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
  }, []);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
        }}
      />
      <div className="relative" ref={containerRef}>
        {/* Dropdown */}
        <SidebarUserDropdown
          isOpen={isDropdownOpen}
          onClose={() => {
            setIsDropdownOpen(false);
          }}
          onOpenSettings={openSettings}
          triggerRect={triggerRect}
        />

        {/* User button */}
        <button
          className="border-border-dark-gray hover:bg-component-hover/20 flex w-full cursor-pointer items-center gap-3 border-t px-3 py-4 transition-colors duration-100"
          onClick={toggleDropdown}
          type="button"
        >
          {/* Avatar */}
          <div className="bg-component-default text-text-white text-body-s flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium">
            {user ? initials : <User size={16} />}
          </div>

          {/* Name + Chevron (when expanded) */}
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                animate={{ opacity: 1, width: 'auto' }}
                className="flex min-w-0 flex-1 items-center justify-between"
                exit={{ opacity: 0, width: 0 }}
                initial={{ opacity: 0, width: 0 }}
                key="user-name-section"
                transition={{ duration: 0.15 }}
              >
                <span className="text-text-white text-body-s truncate">{displayName}</span>
                <ChevronUp
                  className={`text-text-gray shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-0' : 'rotate-180'
                  }`}
                  size={16}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}

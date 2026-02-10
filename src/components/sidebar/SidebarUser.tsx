import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';

import { useAuth } from '@/contexts/user/userContext';

import { useSidebar } from './SidebarContext';

/**
 * Informações do usuário no rodapé da sidebar
 */
export default function SidebarUser() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();

  const displayName = user?.name ?? user?.email ?? 'Usuário';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="border-border-dark-gray flex items-center gap-3 border-t px-3 py-4">
      {/* Avatar */}
      <div className="bg-component-default text-text-white text-body-s flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium">
        {user ? initials : <User size={16} />}
      </div>

      {/* Nome (quando expandida) */}
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.span
            animate={{ opacity: 1, width: 'auto' }}
            className="text-text-white text-body-s truncate"
            exit={{ opacity: 0, width: 0 }}
            initial={{ opacity: 0, width: 0 }}
            key="user-name"
            transition={{ duration: 0.15 }}
          >
            {displayName}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

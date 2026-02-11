import { motion } from 'framer-motion';

import { useSidebar } from './SidebarContext';
import SidebarConversations from './SidebarConversations';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarUser from './SidebarUser';

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_WIDTH_EXPANDED = 250;
const SIDEBAR_WIDTH_COLLAPSED = 60;

/**
 * Sidebar principal da aplicação
 *
 * Desktop: toggle entre expandida (280px) e colapsada (60px)
 * Mobile: overlay com backdrop, abre pelo botão hamburger
 */
export default function Sidebar() {
  const { closeMobile, isExpanded, isMobileOpen } = useSidebar();

  const sidebarWidth =
    isMobileOpen || isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        animate={{
          width: sidebarWidth,
          x: 0,
        }}
        className={`sidebar-color border-stroke-2 fixed z-50 flex h-screen flex-col border-r md:relative md:z-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} `}
        initial={false}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {/* Header */}
        <SidebarHeader />

        {/* Menu + Conversas (scrollable) */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <SidebarMenu />
          <SidebarConversations />
        </div>

        {/* User */}
        <SidebarUser />
      </motion.aside>
    </>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import logoBbox from '@/assets/logo-bbox.svg';

import { useSidebar } from './SidebarContext';

/**
 * Header da sidebar com logo e botão de colapsar
 */
export default function SidebarHeader() {
  const { isExpanded, toggleExpanded } = useSidebar();

  return (
    <div className="flex items-center px-3 pt-8 pb-10">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            animate={{ marginRight: 12, opacity: 1, width: 'auto' }}
            className="overflow-hidden whitespace-nowrap"
            exit={{ marginRight: 0, opacity: 0, width: 0 }}
            initial={{ marginRight: 0, opacity: 0, width: 0 }}
            key="logo-container"
            transition={{ duration: 0.15 }}
          >
            <img alt="Logo BBOX" src={logoBbox} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        animate={{ flexGrow: isExpanded ? 1 : 0 }}
        className="min-w-0"
        initial={false}
        transition={{ duration: 0.15 }}
      />

      <button
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        className="text-text-gray hover:text-text-white rounded-m hover:bg-component-hover hidden shrink-0 cursor-pointer transition-colors md:flex"
        onClick={toggleExpanded}
        type="button"
      >
        {isExpanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
      </button>
    </div>
  );
}

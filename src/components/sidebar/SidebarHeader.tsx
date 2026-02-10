import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import logoBbox from '../../assets/logo-bbox.svg';
import { useSidebar } from './SidebarContext';

/**
 * Header da sidebar com logo e botão de colapsar
 */
export default function SidebarHeader() {
  const { isExpanded, toggleExpanded } = useSidebar();

  return (
    <div className="flex items-center justify-between px-5 py-12">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.span
            animate={{ opacity: 1 }}
            className="text-text-white text-lg font-bold tracking-wider"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="logo-text"
            transition={{ duration: 0.15 }}
          >
            <img alt="Logo BBOX" src={logoBbox} />
          </motion.span>
        ) : null}
      </AnimatePresence>

      <button
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        className="text-text-gray hover:text-text-white rounded-m hover:bg-component-hover hidden cursor-pointer transition-colors md:flex"
        onClick={toggleExpanded}
        type="button"
      >
        {isExpanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
      </button>
    </div>
  );
}

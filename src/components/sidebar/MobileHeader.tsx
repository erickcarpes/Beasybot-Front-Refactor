import { Menu } from 'lucide-react';

import logoBbox from '@/assets/logo-bbox.svg';

import { useSidebar } from './SidebarContext';

/**
 * Header mobile com botão hamburger
 * Visível apenas em telas pequenas (< md)
 */
export default function MobileHeader() {
  const { toggleMobile } = useSidebar();

  return (
    <header className="bg-background border-border-dark-gray flex items-center border-b px-4 py-3 md:hidden">
      <button
        aria-label="Abrir menu"
        className="text-text-gray hover:text-text-white rounded-m cursor-pointer p-1.5 transition-colors"
        onClick={toggleMobile}
        type="button"
      >
        <Menu size={22} />
      </button>

      <img alt="Logo BBOX" className="ml-2" src={logoBbox} />
    </header>
  );
}

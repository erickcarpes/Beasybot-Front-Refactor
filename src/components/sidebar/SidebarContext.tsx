import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SidebarContextValue {
  /** Fecha a sidebar no mobile */
  readonly closeMobile: () => void;
  /** Se a sidebar está expandida (desktop) */
  readonly isExpanded: boolean;
  /** Se a sidebar está aberta no mobile (overlay) */
  readonly isMobileOpen: boolean;
  /** Alterna entre expandido e colapsado */
  readonly toggleExpanded: () => void;
  /** Abre/fecha a sidebar no mobile */
  readonly toggleMobile: () => void;
}

interface SidebarProviderProps {
  readonly children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((previous) => !previous);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((previous) => !previous);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      closeMobile,
      isExpanded,
      isMobileOpen,
      toggleExpanded,
      toggleMobile,
    }),
    [closeMobile, isExpanded, isMobileOpen, toggleExpanded, toggleMobile],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used inside SidebarProvider');
  }

  return context;
};

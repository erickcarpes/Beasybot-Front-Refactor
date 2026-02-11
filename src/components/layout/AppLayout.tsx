import { Outlet } from '@tanstack/react-router';

import { Sidebar, SidebarProvider } from '@/components/sidebar';
import MobileHeader from '@/components/sidebar/MobileHeader';

/**
 * Layout principal da aplicação autenticada
 * Combina Sidebar + área de conteúdo
 */
export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="bg-background flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header com hamburger */}
          <MobileHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { ToastProvider } from '@/contexts/toastContext';
import { AuthProvider } from '@/contexts/user/userContext';

import { routeTree } from './routeTree.gen';
// Render the app with the router
const router = createRouter({ routeTree });

export const queryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.querySelector('#root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

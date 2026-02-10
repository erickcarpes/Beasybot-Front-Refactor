import { createFileRoute } from '@tanstack/react-router';

import AppLayout from '@/components/layout/AppLayout';

const RouteComponent = () => {
  return <AppLayout />;
};

export const Route = createFileRoute('/app/(main)')({
  component: RouteComponent,
});

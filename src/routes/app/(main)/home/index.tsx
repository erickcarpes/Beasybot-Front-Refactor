import { createFileRoute } from '@tanstack/react-router';

import HomePage from '@/pages/HomePage';

export const Route = createFileRoute('/app/(main)/home/')({
  component: HomePage,
});

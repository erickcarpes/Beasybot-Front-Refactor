import { createFileRoute } from '@tanstack/react-router';

import KnowledgePage from '@/pages/KnowledgePage';

export const Route = createFileRoute('/app/(main)/knowledge/')({
  component: KnowledgePage,
  validateSearch: (search: Record<string, unknown>) => ({
    action: (search.action as string) || undefined,
  }),
});

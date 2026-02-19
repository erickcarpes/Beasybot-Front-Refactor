import { createFileRoute } from '@tanstack/react-router';

import MeetingPage from '@/pages/MeetingPage';

export const Route = createFileRoute('/app/(main)/meeting/')({
  component: MeetingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    action: (search.action as string) || undefined,
  }),
});

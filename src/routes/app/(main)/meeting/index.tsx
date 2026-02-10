import { createFileRoute } from '@tanstack/react-router';

import MeetingPage from '@/pages/MeetingPage';

export const Route = createFileRoute('/app/(main)/meeting/')({
  component: MeetingPage,
});

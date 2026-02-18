import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { useToast } from '@/contexts/toastContext';
import {
  type Meeting,
  type MeetingRequest,
  type MeetingStatusUpdated,
  useDeleteMeeting,
  useGetMeetings,
} from '@/features/meeting';
import socketService from '@/services/beasybox-api/socket';

// ============================================================================
// Types
// ============================================================================

interface MeetingCreatedPayload {
  meeting: Meeting;
  tempMeetingId: string;
}

interface UseMeetingsReturn {
  createMeeting: (data: Omit<MeetingRequest, 'userId'>) => void;
  deleteMeeting: (id: string) => Promise<void>;
  isDeleting: boolean;
  isLoading: boolean;
  meetings: Meeting[];
}

// ============================================================================
// Helpers
// ============================================================================

const QUERY_KEY = (userId: string) => ['meetings', userId] as const;

const buildOptimisticMeeting = (data: Omit<MeetingRequest, 'userId'>, tempId: string): Meeting => ({
  completedAt: new Date(),
  createdAt: new Date(),
  duration: 0,
  fileUrl: '',
  id: tempId,
  insights: [],
  participants: [],
  status: 'PENDING',
  summary: 'Aguardando processamento...',
  title: data.title,
  url: data.url,
});

const upsertMeeting = (meetings: Meeting[], meeting: Meeting): Meeting[] => {
  const exists = meetings.some((m) => m.id === meeting.id);
  if (exists) return meetings.map((m) => (m.id === meeting.id ? meeting : m));
  return [meeting, ...meetings];
};

const handleMeetingCreated = (
  previous: Meeting[],
  { meeting, tempMeetingId }: MeetingCreatedPayload,
): Meeting[] => {
  const withoutTemp = previous.filter((m) => m.id !== tempMeetingId);
  return upsertMeeting(withoutTemp, meeting);
};

const handleMeetingStatusUpdated = (
  previous: Meeting[],
  payload: MeetingStatusUpdated,
): Meeting[] =>
  previous.map((m) =>
    m.id === payload.meetingId
      ? {
          ...m,
          ...payload,
        }
      : m,
  );

// ============================================================================
// Hook
// ============================================================================

export const useMeetings = (userId: string): UseMeetingsReturn => {
  const queryClient = useQueryClient();
  const { data: meetings = [], isLoading } = useGetMeetings(userId);
  const { isPending: isDeleting, mutateAsync: deleteMeetingMutation } = useDeleteMeeting();
  const { showToast } = useToast();

  const queryKey = QUERY_KEY(userId);

  // ── Socket listeners ──
  useEffect(() => {
    socketService.connect();
    socketService.emit('joinMeeting', { userId });

    socketService.on('meetingCreated', (data: unknown) => {
      queryClient.setQueryData<Meeting[]>(queryKey, (previous = []) =>
        handleMeetingCreated(previous, data as MeetingCreatedPayload),
      );
    });

    socketService.on('meetingStatusUpdated', (data: unknown) => {
      queryClient.setQueryData<Meeting[]>(queryKey, (previous = []) =>
        handleMeetingStatusUpdated(previous, data as MeetingStatusUpdated),
      );
    });

    return () => {
      socketService.off('meetingCreated');
      socketService.off('meetingStatusUpdated');
      socketService.emit('leaveMeeting', { userId });
    };
  }, [queryClient, queryKey, userId]);

  // ── Actions ──
  const createMeeting = useCallback(
    (data: Omit<MeetingRequest, 'userId'>) => {
      const tempMeetingId = crypto.randomUUID();

      queryClient.setQueryData<Meeting[]>(queryKey, (previous = []) => [
        buildOptimisticMeeting(data, tempMeetingId),
        ...previous,
      ]);

      socketService.emit('createMeeting', {
        tempMeetingId,
        title: data.title,
        url: data.url,
        userId,
      });
    },
    [queryClient, queryKey, userId],
  );

  const deleteMeeting = useCallback(
    async (id: string) => {
      const previousMeetings = queryClient.getQueryData<Meeting[]>(queryKey);

      queryClient.setQueryData<Meeting[]>(queryKey, (previous = []) =>
        previous.filter((m) => m.id !== id),
      );

      try {
        await deleteMeetingMutation({ data: { userId }, id });
        showToast('Reunião excluída com sucesso.');
      } catch {
        queryClient.setQueryData<Meeting[]>(queryKey, previousMeetings);
        showToast('Erro ao excluir a reunião.', 'error');
      }
    },
    [deleteMeetingMutation, queryClient, queryKey, showToast, userId],
  );

  return { createMeeting, deleteMeeting, isDeleting, isLoading, meetings };
};

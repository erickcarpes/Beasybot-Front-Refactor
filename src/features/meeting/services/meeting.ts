import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/beasybox-api';

export interface Meeting {
  completedAt: Date;
  createdAt: Date;
  duration: number;
  fileUrl: string;
  id: string;
  insights: string[];
  participants: string[];
  status: MeetingStatus;
  summary: string;
  title: string;
  transcription: string;
  url: string;
}
export interface MeetingRequest {
  title: string;
  url: string;
  userId: string;
}

export type MeetingStatus =
  | 'COMPLETED'
  | 'DENIED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'RECORDING'
  | 'WAITING_ROOM';

export interface MeetingStatusUpdated {
  completedAt: Date;
  duration: number;
  insights: string[];
  meetingId: string;
  participants: string[];
  status: MeetingStatus;
  summary: string;
}

export interface PutMeetingUploadUrl {
  file: File;
  uploadUrl: string;
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MeetingRequest) => {
      const response = await api.post<Meeting>('/meeting', data);
      return response.data;
    },
    onSuccess: (meeting) => {
      queryClient.setQueryData(['meetings'], (oldData: Meeting[] = []) => [meeting, ...oldData]);
    },
  });
};

export const useGetMeetings = (userId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<Meeting[]>(`/meeting/user/${userId}`);
      return response.data;
    },
    queryKey: ['meetings', userId],
  });
};

export const useGetMeetingUploadUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GetMeetingUploadUrlParameters) => {
      const response: { data: { uploadUrl: string } } = await api.post(`/meeting/upload`, data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
};

export interface GetMeetingUploadUrlParameters {
  contentType: string;
  data: Date;
  fileName: string;
}

export const usePutMeetingUploadUrl = () => {
  return useMutation({
    mutationFn: async ({ file, uploadUrl }: PutMeetingUploadUrl) => {
      const response = await api.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.status;
    },
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, id }: { data: { userId: string }; id: string }) => {
      const response = await api.delete(`/meeting/${id}`, { data });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['meetings'],
      });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/beasybox-api';

export interface Chat {
  id: string;
  name: string;
  origin: ChatOrigin;
  updatedAt: string;
  userId: string;
}

export type ChatOrigin = 'MEETING' | 'WEB' | 'WHATSAPP';

interface ChatRequest {
  meetingId?: string;
  name?: string;
  origin: ChatOrigin;
  userId: string;
}

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chat: ChatRequest) => {
      const response = await api.post<Chat>('/chat', chat);
      return response.data;
    },
    onSuccess: (chat) => {
      queryClient.setQueryData(['chats'], (oldData: Chat[] = []) => [chat, ...oldData]);
    },
  });
};

export const useGetAllChats = () => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<Chat[]>('/chat');
      return response.data;
    },
    queryKey: ['chats'],
  });
};

export const useGetChatById = (id: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<Chat>(`/chat/${id}`);
      return response.data;
    },
    queryKey: ['chat', id],
  });
};

export const useUpdateChat = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Chat>) => {
      const response = await api.put<Chat>(`/chat/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/chat/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useDeleteChats = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/chat/${id}`)));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

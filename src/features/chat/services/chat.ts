import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/beasybox-api';

export interface Chat {
  id: string;
  name: string;
  origin: ChatOrigin;
  updatedAt: string;
  userId: string;
}

export type ChatOrigin = 'MEETING' | 'WEB' | 'WHATSAPP';

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
  return useMutation({
    mutationFn: async (data: Partial<Chat>) => {
      const response = await api.put<Chat>(`/chat/${id}`, data);
      return response.data;
    },
    mutationKey: ['chat', id],
  });
};

export const useDeleteChat = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/chat/${id}`);
      return response.data;
    },
    mutationKey: ['chat', id],
  });
};

export const useDeleteChats = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/chat/${id}`)));
    },
    mutationKey: ['chats-bulk-delete'],
  });
};

import { useQuery } from '@tanstack/react-query';

import type { IFile } from './files';

import api from './api';

export type AuthorEnum = 'BOT' | 'USER';

export interface Message {
  author: AuthorEnum;
  chatId: string;
  createdAt: Date;
  files: IFile[];
  id?: string;
  isStreaming?: boolean;
  status: MessageStatus;
  text: string;
}

export type MessageStatus = 'ANSWERED' | 'RECEIVED';

export const useGetAllMessages = (chatId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<Message[]>(`/message/${chatId}`);
      return response.data;
    },
    queryKey: ['messages', chatId],
  });
};

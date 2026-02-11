import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/beasybox-api';

export interface DeleteFilesResponse {
  deletedIds: string[];
  failedIds: string[];
}

export type FileOrigin = 'WEB' | 'WHATSAPP';

export interface IFile {
  authorId: string;
  createdAt: string;
  fileUrl: string;
  id: string;
  name: string;
  origin: FileOrigin;
  size: number;
  type: string;
}

export const useCreateFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      const response = await api.post<IFile[]>('/file/knowledge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};

export const useGetFilesByUserId = (userId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<IFile[]>(`/file/knowledge/${userId}`);
      return response.data;
    },
    queryKey: ['files', userId],
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/file/${id}`);
    },
  });
};

export const useDeleteFiles = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.delete<DeleteFilesResponse>('files', {
        data: {
          fileIds: ids,
        },
      });
      return response.data;
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useGetFilesByUserId = (userId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get<IFile[]>(`/file/knowledge/${userId}`);
      return response.data;
    },
    queryKey: ['files'],
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/file/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useDeleteFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.delete<DeleteFilesResponse>('files', {
        data: {
          fileIds: ids,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

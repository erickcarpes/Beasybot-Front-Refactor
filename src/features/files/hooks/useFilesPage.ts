import { useCallback, useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import {
  useCreateFiles,
  useDeleteFile,
  useDeleteFiles,
  useGetFilesByUserId,
} from '@/services/beasybox-api/files';

interface UseFilesPageProps {
  userId: string;
}

export const useFilesPage = ({ userId }: UseFilesPageProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { data: files = [], isLoading } = useGetFilesByUserId(userId);
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { isPending: isDeleteFilesPending, mutate: deleteFiles } = useDeleteFiles();
  const { isPending: isCreateFilesPending, mutateAsync: createFiles } = useCreateFiles();
  const { showToast } = useToast();

  const handleSingleDelete = useCallback(
    async (id: string) => {
      await deleteFile(id, {
        onError: () => {
          showToast('Erro ao excluir arquivo.', 'error');
        },
        onSuccess: () => {
          showToast('Arquivo excluído com sucesso!', 'success');
        },
      });
    },
    [deleteFile, showToast],
  );

  const handleBulkDelete = useCallback(
    (onSuccess?: () => void) => {
      const selectedIds = Object.keys(rowSelection);
      deleteFiles(selectedIds, {
        onError: () => {
          showToast('Erro ao excluir arquivos.', 'error');
        },
        onSuccess: () => {
          showToast('Arquivos excluídos com sucesso!', 'success');
          setRowSelection({});
          onSuccess?.();
        },
      });
    },
    [deleteFiles, rowSelection, showToast],
  );

  const handleCreateFiles = useCallback(
    async (filesToUpload: File[], onSuccess?: () => void) => {
      await createFiles(filesToUpload, {
        onError: () => {
          showToast('Erro ao enviar arquivos.', 'error');
        },
        onSuccess: () => {
          showToast('Arquivos enviados com sucesso!', 'success');
          onSuccess?.();
        },
      });
    },
    [createFiles, showToast],
  );

  return {
    files,
    globalFilter,
    handleBulkDelete,
    handleCreateFiles,
    handleSingleDelete,
    isCreateFilesPending,
    isDeleteFilesPending,
    isLoading,
    rowSelection,
    selectedFileIds: Object.keys(rowSelection),
    setGlobalFilter,
    setRowSelection,
  };
};

import { useCallback, useState } from 'react';

import { isAllowedExtension, isWithinSizeLimit, MAX_FILE_SIZE_MB } from '@/utils/fileUtils';

// ============================================================================
// Types
// ============================================================================

interface UseFileAttachmentsOptions {
  readonly onValidationError?: (message: string) => void;
}

interface UseFileAttachmentsReturn {
  /** Adiciona arquivos (validando tipo, tamanho e duplicatas) */
  readonly addFiles: (files: FileList | null) => void;
  /** Limpa todos os arquivos */
  readonly clearFiles: () => void;
  /** Handlers de drag & drop para o container */
  readonly dragHandlers: {
    readonly onDragLeave: (e: React.DragEvent) => void;
    readonly onDragOver: (e: React.DragEvent) => void;
    readonly onDrop: (e: React.DragEvent) => void;
  };
  /** Lista de arquivos anexados */
  readonly files: File[];
  /** Se está ocorrendo drag over */
  readonly isDragging: boolean;
  /** Remove um arquivo pelo nome */
  readonly removeFile: (fileName: string) => void;
}

// ============================================================================
// Hook
// ============================================================================

export const useFileAttachments = ({
  onValidationError,
}: UseFileAttachmentsOptions = {}): UseFileAttachmentsReturn => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const file of fileList) {
        if (files.some((f) => f.name === file.name)) continue;

        if (!isAllowedExtension(file.name)) {
          rejected.push(`'${file.name}': formato inválido`);
        } else if (isWithinSizeLimit(file)) {
          accepted.push(file);
        } else {
          rejected.push(`'${file.name}': muito grande (limite: ${String(MAX_FILE_SIZE_MB)}MB)`);
        }
      }

      if (accepted.length > 0) {
        setFiles((previous) => [...previous, ...accepted]);
      }

      if (rejected.length > 0) {
        onValidationError?.(
          rejected.length === 1
            ? `Arquivo ${rejected[0]}`
            : `${String(rejected.length)} arquivos foram rejeitados.`,
        );
      }
    },
    [files, onValidationError],
  );

  const removeFile = useCallback((fileName: string) => {
    setFiles((previous) => previous.filter((f) => f.name !== fileName));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const dragHandlers = {
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
  };

  return { addFiles, clearFiles, dragHandlers, files, isDragging, removeFile };
};

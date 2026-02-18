import Button from '@/components/ui/Button';
import Dropzone from '@/components/ui/Dropzone';
import { FileChip } from '@/features/chat';
import { useFileAttachments } from '@/hooks/useFileAttachments';

// ============================================================================
// Types
// ============================================================================

interface ImportTabProps {
  readonly onAdvance: (files: File[]) => void;
  readonly onCancel: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function ImportTab({ onAdvance, onCancel }: ImportTabProps) {
  const { addFiles, dragHandlers, files, isDragging, removeFile } = useFileAttachments();

  const handleAdvance = () => {
    if (files.length === 0) return;
    onAdvance(files);
  };

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-body-m text-text-2 mb-6">
        Envie arquivos de áudio e vídeo de suas reuniões para que sejam salvos na nossa plataforma.
      </p>

      <Dropzone
        accept="audio/*,video/*"
        className="flex-1"
        description="Suporta arquivos de áudio e vídeo."
        dragHandlers={dragHandlers}
        isDragging={isDragging}
        onAddFiles={addFiles}
        title="Arraste seus arquivos ou clique para procurar"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-body-s text-text-2 font-medium">
            Arquivos selecionados ({files.length})
          </p>
          <div className="conversation-list-scrollbar grid max-h-[120px] grid-cols-2 gap-2 overflow-y-auto">
            {files.map((file) => (
              <FileChip
                className="w-full max-w-none"
                file={file}
                key={file.name}
                onRemove={removeFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex w-full justify-between gap-3 pt-6">
        <Button className="flex-1" onClick={onCancel} size="full" type="button" variant="neutral">
          Cancelar
        </Button>
        <Button
          className="flex-1"
          disabled={files.length === 0}
          onClick={handleAdvance}
          size="full"
          type="button"
          variant="primary"
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}

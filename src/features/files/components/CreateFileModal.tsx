import { AnimatePresence, motion } from 'framer-motion';
import { CloudUpload } from 'lucide-react';
import { useRef } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal/Index';
import { FileChip } from '@/features/chat';
import { cn } from '@/utils/cn';

interface CreateFileModalProps {
  readonly dragHandlers: {
    readonly onDragLeave: (e: React.DragEvent) => void;
    readonly onDragOver: (e: React.DragEvent) => void;
    readonly onDrop: (e: React.DragEvent) => void;
  };
  readonly files: File[];
  readonly isDragging: boolean;
  readonly isOpen: boolean;
  readonly isPending: boolean;
  readonly onAddFiles: (files: FileList | null) => void;
  readonly onClose: () => void;
  readonly onRemoveFile: (fileName: string) => void;
  readonly onSubmit: () => void;
}

export default function CreateFileModal({
  dragHandlers,
  files,
  isDragging,
  isOpen,
  isPending,
  onAddFiles,
  onClose,
  onRemoveFile,
  onSubmit,
}: CreateFileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Modal.Root className="max-w-lg">
              <Modal.Title onClose={onClose} visible>
                Adicionar arquivos
              </Modal.Title>

              <Modal.Description>
                Selecione os arquivos que deseja adicionar à sua base de conhecimento.
              </Modal.Description>

              <div className="flex w-full flex-col gap-4">
                {/* Dropzone */}
                <div
                  className={cn(
                    'border-stroke-2 hover:bg-component-hover group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors',
                    isDragging && 'border-brand bg-brand/5',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  {...dragHandlers}
                >
                  <div className="bg-component-default group-hover:bg-component-pressed mb-3 flex size-12 items-center justify-center rounded-full transition-colors">
                    <CloudUpload className="text-text-2 group-hover:text-text-1" size={24} />
                  </div>
                  <p className="text-body-m text-text-1 font-medium">
                    Clique para fazer upload ou arraste e solte
                  </p>
                  <p className="text-body-s text-text-2 mt-1">SVG, PNG, JPG ou GIF (max. 100MB)</p>
                  <input
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      onAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                    ref={fileInputRef}
                    type="file"
                  />
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-body-s text-text-2 font-medium">
                      Arquivos selecionados ({files.length})
                    </p>
                    <div className="conversation-list-scrollbar grid max-h-[160px] grid-cols-2 gap-2 overflow-y-auto">
                      {files.map((file) => (
                        <FileChip
                          className="w-full max-w-none"
                          file={file}
                          key={file.name}
                          onRemove={onRemoveFile}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Modal.Actions className="flex justify-center gap-3 pt-6">
                <Button
                  disabled={isPending}
                  onClick={onClose}
                  size="medium"
                  type="button"
                  variant="neutral"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isPending || files.length === 0}
                  onClick={onSubmit}
                  size="medium"
                  type="button"
                  variant="primary"
                >
                  {isPending ? 'Enviando...' : 'Adicionar arquivos'}
                </Button>
              </Modal.Actions>
            </Modal.Root>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

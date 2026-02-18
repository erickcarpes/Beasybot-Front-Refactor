import { CloudUpload } from 'lucide-react';
import { useRef } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// Types
// ============================================================================

interface DropzoneProps {
  readonly accept?: string;
  readonly className?: string;
  readonly description?: string;
  readonly dragHandlers: {
    readonly onDragLeave: (e: React.DragEvent) => void;
    readonly onDragOver: (e: React.DragEvent) => void;
    readonly onDrop: (e: React.DragEvent) => void;
  };
  readonly isDragging: boolean;
  readonly onAddFiles: (files: FileList | null) => void;
  readonly title?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function Dropzone({
  accept,
  className,
  description = 'SVG, PNG, JPG ou GIF (max. 100MB)',
  dragHandlers,
  isDragging,
  onAddFiles,
  title = 'Clique para fazer upload ou arraste e solte',
}: Readonly<DropzoneProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        'border-stroke-2 hover:bg-component-hover group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors',
        isDragging && 'border-brand bg-brand/5',
        className,
      )}
      onClick={() => fileInputRef.current?.click()}
      {...dragHandlers}
    >
      <div className="bg-component-default group-hover:bg-component-pressed mb-3 flex size-12 items-center justify-center rounded-full transition-colors">
        <CloudUpload className="text-text-2 group-hover:text-text-1" size={24} />
      </div>
      <p className="text-body-m text-text-1 font-medium">{title}</p>
      <p className="text-body-xs text-text-2 mt-1">{description}</p>
      <input
        accept={accept}
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
  );
}

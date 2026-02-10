import { X } from 'lucide-react';

import { formatFileSize, getFileType, ICONS_CONFIG } from '@/utils/fileUtils';

// ============================================================================
// Types
// ============================================================================

interface FileChipProps {
  readonly file: File;
  readonly onRemove: (fileName: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export default function FileChip({ file, onRemove }: FileChipProps) {
  const fileType = getFileType(file.name);
  const { color, Icon } = ICONS_CONFIG[fileType];

  return (
    <div className="component-gradient border-stroke-2 flex max-w-[220px] items-center gap-3 rounded-xl border px-3 py-2">
      {/* File type icon */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon color={color} size={20} />
      </div>

      {/* File info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-s text-text-1 truncate">{file.name}</span>
        <span className="text-body-xs text-text-2">{formatFileSize(file.size)}</span>
      </div>

      {/* Remove */}
      <button
        aria-label={`Remover ${file.name}`}
        className="text-text-2 hover:text-text-1 shrink-0 cursor-pointer transition-colors"
        onClick={() => {
          onRemove(file.name);
        }}
        type="button"
      >
        <X size={14} />
      </button>
    </div>
  );
}

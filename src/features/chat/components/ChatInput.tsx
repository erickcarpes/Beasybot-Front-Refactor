import { ArrowUp, Plus, Square } from 'lucide-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useFileAttachments } from '@/hooks/useFileAttachments';
import { cn } from '@/utils/cn';

import FileChip from './FileChip';

// ============================================================================
// Types
// ============================================================================

interface ChatInputData {
  files: File[];
  text: string;
}

interface ChatInputProps {
  readonly disabled?: boolean;
  readonly onSendMessage: (data: ChatInputData) => void;
  readonly onStop?: () => void;
  readonly onValidationError?: (message: string) => void;
  readonly placeholder?: string;
  readonly sending?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_TEXTAREA_HEIGHT = 200;
const MAX_VISIBLE_CHIPS = 5;

// ============================================================================
// Component
// ============================================================================

export default function ChatInput({
  disabled = false,
  onSendMessage,
  onStop,
  onValidationError,
  placeholder = 'Como posso te ajudar?',
  sending = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addFiles, clearFiles, dragHandlers, files, isDragging, removeFile } = useFileAttachments({
    onValidationError,
  });

  // ── Auto-resize ──
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${String(Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT))}px`;
  }, [message]);

  // ── Actions ──
  const canSend = !disabled && (message.trim().length > 0 || files.length > 0);

  const handleSubmit = () => {
    if (!canSend) return;

    onSendMessage({ files, text: message.trim() });
    setMessage('');
    clearFiles();

    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        'component-gradient relative flex w-full max-w-[720px] flex-col overflow-hidden rounded-[20px] px-5 py-4 transition-shadow',
        isDragging && 'ring-text-1 ring-2',
      )}
      {...dragHandlers}
    >
      {/* Top Border Gradient */}
      <div
        className="absolute top-0 left-0 h-px w-full"
        style={{ background: 'var(--stroke-in-chat)' }}
      />

      {/* File Chips */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.slice(0, MAX_VISIBLE_CHIPS).map((file) => (
            <FileChip file={file} key={file.name} onRemove={removeFile} />
          ))}

          {files.length > MAX_VISIBLE_CHIPS && (
            <div className="border-stroke component-gradient text-body-m flex size-10 items-center justify-center rounded-lg border font-bold text-white">
              +{files.length - MAX_VISIBLE_CHIPS}
            </div>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea
        className="text-body-m text-text-1 placeholder:text-text-2 conversation-list-scrollbar w-full resize-none bg-transparent outline-none"
        disabled={disabled}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Aguardando...' : placeholder}
        ref={textareaRef}
        rows={1}
        value={message}
      />

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        <button
          aria-label="Anexar arquivo"
          className="button-neutral-no-border active:bg-component-pressed rounded-m flex size-6 cursor-pointer items-center justify-center p-1"
          disabled={disabled}
          onClick={() => {
            fileInputRef.current?.click();
          }}
          type="button"
        >
          <Plus size={16} />
        </button>

        <button
          aria-label={sending ? 'Parar envio' : 'Enviar mensagem'}
          className={cn(
            'group rounded-m flex size-6 cursor-pointer items-center justify-center p-1 transition-all',
            canSend || sending
              ? 'button-neutral-no-border bg-text-white text-component-default hover:bg-component-hover hover:text-white'
              : 'bg-component-hover text-text-2 disabled:cursor-not-allowed',
          )}
          disabled={!canSend && !sending}
          onClick={sending ? onStop : handleSubmit}
          type="button"
        >
          {sending ? (
            <Square
              className="text-component-default group-hover:text-white"
              fill="currentColor"
              size={16}
            />
          ) : (
            <ArrowUp className="text-component-default group-hover:text-white" size={16} />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        className="hidden"
        multiple
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}

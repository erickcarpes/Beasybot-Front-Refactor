import { type Message } from '@/services/beasybox-api/messages';
import { cn } from '@/utils/cn';

import FileChip from '@/components/chat/FileChip';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.author === 'USER';

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-body-m',
          isUser
            ? 'bg-brand text-text-white rounded-tr-sm'
            : 'bg-component-default text-text-1 rounded-tl-sm',
        )}
      >
        {message.files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
                {message.files.map((file) => (
                    <FileChip key={file.id} file={file} className={isUser ? "bg-white/10 border-white/20 text-white" : ""} />
                ))}
            </div>
        )}
        <div className="whitespace-pre-wrap">{message.text}</div>
      </div>
      <span className="text-body-s text-text-2 px-1">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
}

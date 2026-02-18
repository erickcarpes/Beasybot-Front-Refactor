import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import arrowLogo from '@/assets/arrow-logo.svg';
import { type Message } from '@/services/beasybox-api/messages';
import { cn } from '@/utils/cn';

import FileChip from './FileChip';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
  readonly isLast?: boolean;
  readonly message: Message;
}

export default function MessageBubble({ isLast, message }: MessageBubbleProps) {
  const isUser = message.author === 'USER';
  const showBotIcon = !isUser && isLast;
  const isThinking = message.text === 'Pensando...';

  return (
    <div className={cn('flex w-full flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'flex max-w-[90%] justify-center gap-3',
          isUser ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        {!isUser && (
          <div className="mt-1 flex h-6 w-6 shrink-0">
            {showBotIcon && <img alt="Bot Indicator" className="h-5 w-5" src={arrowLogo} />}
          </div>
        )}

        <div
          className={cn(
            'text-body-m rounded-2xl px-4 py-3',
            isUser
              ? 'bg-component-default text-text-1 rounded-tr-sm'
              : 'text-text-1 flex w-full p-0',
          )}
        >
          {message.files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.files.map((file) => (
                <FileChip
                  className={isUser ? 'border-white/20 bg-white/10 text-white' : ''}
                  file={file}
                  key={file.id}
                />
              ))}
            </div>
          )}
          {isThinking ? (
            <TypingIndicator />
          ) : (
            <div className={`prose prose-invert max-w-none ${isUser ? 'text-text-1' : ''}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

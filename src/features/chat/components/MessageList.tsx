import { useEffect, useRef } from 'react';

import { type Message } from '@/services/beasybox-api/messages';

import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';

interface MessageListProps {
  readonly isLoading?: boolean;
  readonly messages: Message[];
}

export default function MessageList({ isLoading, messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex w-full max-w-[720px] flex-col items-center gap-8 py-4 md:py-8">
      {isLoading && messages.length === 0 ? (
        <>
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </>
      ) : (
        messages.map((message, index) => (
          <MessageBubble
            isLast={index === messages.length - 1}
            key={message.id ?? `${message.createdAt.toDateString()}-${index.toString()}`} // Fallback key if id is missing temporarily
            message={message}
          />
        ))
      )}
      <div ref={scrollRef} />
    </div>
  );
}

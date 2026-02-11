import { useEffect, useRef } from 'react';

import { type Message } from '@/services/beasybox-api/messages';

import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-8">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || `${message.createdAt}-${index}`} // Fallback key if id is missing temporarily
          message={message}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
}

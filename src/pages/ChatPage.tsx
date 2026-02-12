import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

import { useCurrentUser } from '@/contexts/user/userContext';
import { MessageList } from '@/features/chat';
import { useChat } from '@/features/chat';
import { ChatInput } from '@/features/chat';
import { Route } from '@/routes/app/(main)/chat/$chatId';

export default function ChatPage() {
  const { chatId } = Route.useParams();
  // Use useLocation to get search params safely without route typing issues
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const initialMessage = searchParams.get('q');

  const user = useCurrentUser();
  const { isLoading, messages, sendMessage } = useChat({ chatId, userId: user.id });

  const hasSentInitialMessage = useRef(false);

  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current && !isLoading) {
      sendMessage(initialMessage, []);
      hasSentInitialMessage.current = true;
      // Optional: Remove query param to prevent resend on refresh
      globalThis.history.replaceState({}, '', globalThis.location.pathname);
    }
  }, [initialMessage, isLoading, sendMessage]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 justify-center overflow-y-auto">
        <MessageList isLoading={isLoading} messages={messages} />
      </div>
      <div className="flex justify-center p-4">
        <ChatInput
          onSendMessage={({ text }) => {
            // TODO: Handle file uploads before sending if files are present
            sendMessage(text, []);
          }}
          sending={isLoading}
        />
      </div>
    </div>
  );
}

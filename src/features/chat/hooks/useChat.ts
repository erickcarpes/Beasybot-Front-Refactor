import { useCallback, useEffect, useState } from 'react';

import type { IFile } from '@/services/beasybox-api/files';
import type { Message } from '@/services/beasybox-api/messages';

import { useGetAllMessages } from '@/services/beasybox-api/messages';
import socketService from '@/services/beasybox-api/socket';

interface UseChatProps {
  chatId: string;
  userId: string;
}

interface UseChatReturn {
  isLoading: boolean;
  messages: Message[];
  sendMessage: (text: string, files: IFile[]) => void;
}

export const useChat = ({ chatId, userId }: UseChatProps): UseChatReturn => {
  const { data: initialMessages, isLoading: isLoadingInitialMessages } = useGetAllMessages(chatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial messages when they load or when chat changes
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const handleMessageConfirmed = useCallback(
    ({ tempUserId, userMessage }: { tempUserId: string; userMessage: Message }) => {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === tempUserId ? { ...userMessage, status: 'RECEIVED' } : message,
        ),
      );
    },
    [],
  );

  const handleChatResponse = useCallback(
    ({ chunkMessage, tempBotId }: { chunkMessage: { text: string }; tempBotId?: string }) => {
      setMessages((previous) => {
        const lastMessage = previous.at(-1);

        if (lastMessage?.author === 'BOT') {
          const isThinking = lastMessage.text === 'Pensando...';
          const newText = isThinking ? chunkMessage.text : lastMessage.text + chunkMessage.text;

          return [
            ...previous.slice(0, -1),
            {
              ...lastMessage,
              isStreaming: true,
              text: newText,
            },
          ];
        }

        return [
          ...previous,
          {
            author: 'BOT',
            chatId,
            createdAt: new Date(),
            files: [],
            id: tempBotId,
            isStreaming: true,
            status: 'RECEIVED',
            text: chunkMessage.text,
          },
        ];
      });
      setIsLoading(false);
    },
    [chatId],
  );

  const handleMessageCreated = useCallback(({ botMessage }: { botMessage: Message }) => {
    setMessages((previous) => {
      const lastMessage = previous.at(-1);
      // Check if we were streaming this message (by ID or if last was BOT and streaming)
      // Ideally check ID, but here usage is simple.
      if (lastMessage?.author === 'BOT' && lastMessage.isStreaming) {
        return [...previous.slice(0, -1), botMessage];
      }
      return [...previous, botMessage];
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!chatId || !userId) return;

    socketService.connect();
    socketService.emit('joinChat', { chatId, userId });

    socketService.on('messageConfirmed', handleMessageConfirmed);
    socketService.on('chatResponse', handleChatResponse);
    socketService.on('messageCreated', handleMessageCreated);

    return () => {
      socketService.off('messageConfirmed');
      socketService.off('chatResponse');
      socketService.off('messageCreated');
    };
  }, [chatId, userId, handleMessageConfirmed, handleChatResponse, handleMessageCreated]);

  const sendMessage = (text: string, files: IFile[]) => {
    const optimisticUserMessage: Message = {
      author: 'USER',
      chatId,
      createdAt: new Date(),
      files,
      id: crypto.randomUUID(),
      status: 'ANSWERED',
      text,
    };

    const optimisticBotMessage: Message = {
      author: 'BOT',
      chatId,
      createdAt: new Date(),
      files: [],
      id: crypto.randomUUID(),
      isStreaming: true,
      status: 'RECEIVED',
      text: 'Pensando...',
    };

    setMessages((previous) => [...previous, optimisticUserMessage, optimisticBotMessage]);
    setIsLoading(true); // Set loading to true while waiting for response/stream

    socketService.emit('sendMessage', {
      chatId,
      filesId: files.map((f) => f.id),
      tempBotId: optimisticBotMessage.id,
      tempUserId: optimisticUserMessage.id,
      text,
      userId,
    });
  };

  return {
    isLoading: isLoading || isLoadingInitialMessages,
    messages,
    sendMessage,
  };
};

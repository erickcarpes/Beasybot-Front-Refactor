import { useEffect, useRef, useState } from 'react';

import type { IFile } from '@/services/beasybox-api/files';
import type { Message } from '@/services/beasybox-api/messages';
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

export function useChat({ chatId, userId }: UseChatProps): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  // Keep ref in sync with state to access latest messages in socket listeners
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!chatId || !userId) return;

    // Connect and join chat
    socketService.connect();
    socketService.emit('joinChat', { chatId, userId });
    setIsLoading(true);

    // Socket event listeners
    const handleMessageConfirmed = (userMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id || (msg.createdAt === userMessage.createdAt && msg.text === userMessage.text)
            ? { ...userMessage, status: 'RECEIVED' }
            : msg,
        ),
      );
    };

    const handleChatResponse = (data: { chunkMessage: { text: string }; messageId?: string }) => {
      // Logic to append chunk to the last message (bot message)
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.author === 'AGENT') {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, text: lastMessage.text + data.chunkMessage.text },
          ];
        } else {
          // If no agent message exists yet, create one
           return [
            ...prev,
            {
              author: 'AGENT',
              chatId,
              createdAt: new Date(),
              files: [],
              status: 'RECEIVED',
              text: data.chunkMessage.text,
              id: data.messageId, // Optional if backend sends it
            },
          ];
        }
      });
      setIsLoading(false);
    };

    const handleMessageCreated = (botMessage: Message) => {
      // Replace the streaming message with the final message or just add it if not exists
       setMessages((prev) => {
        // Check if we were streaming this message
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.author === 'AGENT') {
             return [...prev.slice(0, -1), botMessage];
        }
        return [...prev, botMessage];
      });
      setIsLoading(false);
    };

    socketService.on('messageConfirmed', handleMessageConfirmed);
    socketService.on('chatResponse', handleChatResponse);
    socketService.on('messageCreated', handleMessageCreated);

    // Cleanup
    return () => {
      socketService.off('messageConfirmed');
      socketService.off('chatResponse');
      socketService.off('messageCreated');
      // optional: socketService.disconnect() if we want to close connection on unmount
      // but usually we keep it open for SPA navigation
    };
  }, [chatId, userId]);

  const sendMessage = (text: string, files: IFile[]) => {
    // Optimistic update
    const tempId = crypto.randomUUID();
    const optimisticMessage: Message = {
      author: 'USER',
      chatId,
      createdAt: new Date(),
      files,
      id: tempId,
      status: 'ANSWERED', // Initial status, will update to RECEIVED on confirmation
      text,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    socketService.emit('sendMessage', {
      chatId,
      filesId: files.map((f) => f.id),
      text,
      userId,
    });
  };

  return {
    isLoading,
    messages,
    sendMessage,
  };
}

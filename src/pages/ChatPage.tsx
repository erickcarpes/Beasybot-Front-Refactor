import { useCurrentUser } from '@/contexts/user/userContext';
import MessageList from '@/features/chat/components/MessageList';
import { useChat } from '@/features/chat/hooks/useChat';
import ChatInput from '@/components/chat/ChatInput';
import { Route } from '@/routes/app/(main)/chat/$chatId';

export default function ChatPage() {
  const { chatId } = Route.useParams();
  const user = useCurrentUser();
  const { isLoading, messages, sendMessage } = useChat({ chatId, userId: user.id });

  return (
    <div className="flex h-full flex-col">
       <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
       </div>
       <div className="flex justify-center p-4">
        <ChatInput
            onSendMessage={({ files, text }) => sendMessage(text, files)}
            sending={isLoading}
        />
       </div>
    </div>
  );
}

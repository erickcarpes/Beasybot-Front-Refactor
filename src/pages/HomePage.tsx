import { useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { Sparkles } from 'lucide-react';

import loadingBotAnimation from '@/assets/loading-bot-message.json';
import { useToast } from '@/contexts/toastContext';
import { useCurrentUser } from '@/contexts/user/userContext';
import { useCreateChat } from '@/features/chat';
import { ChatInput } from '@/features/chat';
import { ActionCard, HOME_ACTIONS, HOME_SUGGESTIONS, SuggestionItem } from '@/features/home';

export default function HomePage() {
  const user = useCurrentUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { isPending, mutateAsync: createChat } = useCreateChat();

  const displayName = user.name ?? 'usuário';

  const handleChatSubmit = async (data: { files: File[]; text: string }) => {
    await createChat(
      {
        name: data.text.slice(0, 50), // Optional initial name based on message
        origin: 'WEB',
        userId: user.id,
      },
      {
        onError: () => {
          showToast('Erro ao criar chat. Tente novamente.', 'error');
        },
        onSuccess: (chat) => {
          // Redirect to the new chat.
          // We assume the chat page will handle sending the initial message if we pass it via router state
          // OR we need to send it here.
          // Since the previous plan mentioned "redirect with new message already created",
          // and the hook doesn't seem to take a message, we might need to rely on the socket in UseChat
          // to send it once connected, OR we send it here via socket IF we can connect.
          // However, cleaner UX is often: Create Chat ID -> Redirect -> ChatPage mounts & connects -> Sends message.
          // To pass the message to ChatPage, we can use search params or state.
          // Let's use search params for simplicity and robustness.
          void navigate({
            params: { chatId: chat.id },
            search: { q: data.text }, // Pass message as query param 'q'
            to: '/app/chat/$chatId',
          });
        },
      },
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex min-h-full w-full flex-col items-center px-4 py-8 md:px-8 lg:py-12">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
          {/* ─── Greeting ─── */}
          <div className="flex items-center gap-3">
            <Lottie animationData={loadingBotAnimation} className="size-12" loop />
            <h1 className="text-subtitle-m text-text-white font-semibold italic">
              Olá{displayName ? `, ${displayName}` : ''}, seja bem-vindo!
            </h1>
          </div>

          {/* ─── Chat Input ─── */}
          <ChatInput
            onSendMessage={handleChatSubmit}
            onValidationError={(message) => {
              showToast(message, 'error');
            }}
            sending={isPending}
          />

          {/* ─── Ações ─── */}
          <section className="flex w-full flex-col gap-4">
            <h2 className="text-body-l text-text-white font-semibold">Ações</h2>

            <div className="flex flex-col gap-4 md:flex-row">
              {HOME_ACTIONS.map((action) => (
                <ActionCard
                  description={action.description}
                  icon={action.icon}
                  key={action.title}
                  title={action.title}
                  to={action.to}
                />
              ))}
            </div>
          </section>

          {/* ─── Sugestões Inteligentes ─── */}
          <section className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-body-l text-text-white font-semibold">Sugestões inteligentes</h2>
              <Sparkles size={20} />
            </div>

            <div className="flex flex-col gap-3">
              {HOME_SUGGESTIONS.map((suggestion) => (
                <SuggestionItem
                  description={suggestion.description}
                  disabled
                  key={suggestion.title}
                  title={suggestion.title}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

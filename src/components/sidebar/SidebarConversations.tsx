import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/contexts/toastContext';
import { type Chat, type ChatOrigin, useDeleteChat, useGetAllChats } from '@/features/chat';

import { useSidebar } from './SidebarContext';
import SidebarItem from './SidebarItem';

const ORIGIN_LABELS: Record<ChatOrigin, string> = {
  MEETING: 'Web',
  WEB: 'Web',
  WHATSAPP: 'Whatsapp',
};

/**
 * Lista de conversas recentes na sidebar, agrupadas por origem (WEB / WHATSAPP)
 * Só aparece quando a sidebar está expandida
 */
export default function SidebarConversations() {
  const { data: chats = [] } = useGetAllChats();
  const { isExpanded } = useSidebar();
  const [activeConversationId, setActiveConversationId] = useState<null | string>(null);

  const { mutateAsync: deleteChat } = useDeleteChat();
  const { showToast } = useToast();

  const webConversations = chats.filter((c) => c.origin === 'WEB' || c.origin === 'MEETING');
  const whatsappConversations = chats.filter((c) => c.origin === 'WHATSAPP');

  const handleDeleteChat = async (id: string) => {
    try {
      await deleteChat(id);
      showToast('Conversa excluída com sucesso!', 'success');
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch {
      showToast('Erro ao excluir conversa.', 'error');
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex flex-col gap-1 px-2"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="conversations"
            transition={{ duration: 0.15 }}
          >
            {/* Divider */}
            <div className="border-border-dark-gray mx-2 my-2 border-t" />

            <span className="text-text-1 text-body-m px-3 py-1 font-medium tracking-wider">
              Conversas
            </span>

            <ConversationGroup
              activeConversationId={activeConversationId}
              conversations={webConversations}
              onDeleteChat={(id) => {
                void handleDeleteChat(id);
              }}
              onSelectConversation={setActiveConversationId}
              origin="WEB"
            />
            <ConversationGroup
              activeConversationId={activeConversationId}
              conversations={whatsappConversations}
              onDeleteChat={(id) => {
                void handleDeleteChat(id);
              }}
              onSelectConversation={setActiveConversationId}
              origin="WHATSAPP"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/**
 * Grupo colapsável de conversas por origem
 */
function ConversationGroup({
  activeConversationId,
  conversations,
  onDeleteChat,
  onSelectConversation,
  origin,
}: {
  readonly activeConversationId: null | string;
  readonly conversations: Chat[];
  readonly onDeleteChat: (id: string) => void;
  readonly onSelectConversation: (id: string) => void;
  readonly origin: ChatOrigin;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Header do grupo (toggle) */}
      <button
        className="text-text-1 hover:bg-component-default rounded-m flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left transition-colors"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        type="button"
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="flex items-center"
          transition={{ duration: 0.15 }}
        >
          <ChevronRight className="size-4" />
        </motion.span>

        <span className="text-body-s font-medium">{ORIGIN_LABELS[origin]}</span>
      </button>

      {/* Lista de conversas */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{
              height: 'auto',
              opacity: 1,
              transitionEnd: { overflow: 'visible' },
            }}
            className="flex flex-col gap-0.5"
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {conversations.map((conversation) => (
              <SidebarItem
                activeConversationId={activeConversationId}
                conversation={conversation}
                key={conversation.id}
                onDeleteChat={onDeleteChat}
                onSelectConversation={onSelectConversation}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

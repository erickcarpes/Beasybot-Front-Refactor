import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { type Chat, type ChatOrigin, useGetAllChats } from '@/features/chat';
import { cn } from '@/utils/cn';

import { useSidebar } from './SidebarContext';

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

  const webConversations = chats.filter((c) => c.origin === 'WEB' || c.origin === 'MEETING');
  const whatsappConversations = chats.filter((c) => c.origin === 'WHATSAPP');

  return (
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
            onSelectConversation={setActiveConversationId}
            origin="WEB"
          />
          <ConversationGroup
            activeConversationId={activeConversationId}
            conversations={whatsappConversations}
            onSelectConversation={setActiveConversationId}
            origin="WHATSAPP"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Grupo colapsável de conversas por origem
 */
function ConversationGroup({
  activeConversationId,
  conversations,
  onSelectConversation,
  origin,
}: {
  readonly activeConversationId: null | string;
  readonly conversations: Chat[];
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
            animate={{ height: 'auto', opacity: 1 }}
            className="flex flex-col gap-0.5 overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {conversations.map((conversation) => {
              const isActive = activeConversationId === conversation.id;

              return (
                <button
                  className={cn(
                    'rounded-m ml-7 cursor-pointer truncate py-1.5 pl-2 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-component-default text-text-white'
                      : 'text-text-gray hover:bg-component-hover/50 hover:text-text-white',
                  )}
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                  }}
                  type="button"
                >
                  {conversation.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

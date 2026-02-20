import { useNavigate } from '@tanstack/react-router';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

import DropdownMenu from '@/components/ui/DropdownMenu';
import { useToast } from '@/contexts/toastContext';
import { type Chat, useUpdateChat } from '@/features/chat';
import { cn } from '@/utils/cn';

export default function SidebarItem({
  activeConversationId,
  conversation,
  onDeleteChat,
  onSelectConversation,
}: {
  readonly activeConversationId: null | string;
  readonly conversation: Chat;
  readonly onDeleteChat: (id: string) => void;
  readonly onSelectConversation: (id: string) => void;
}) {
  const navigate = useNavigate();
  const isActive = activeConversationId === conversation.id;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(conversation.name);
  const { mutateAsync: updateChat } = useUpdateChat(conversation.id);
  const { showToast } = useToast();

  const handleRename = async () => {
    setIsEditing(false);
    if (!name.trim() || name.trim() === conversation.name) {
      setName(conversation.name);
      return;
    }
    try {
      await updateChat({ name: name.trim() });
      showToast('Conversa renomeada com sucesso!', 'success');
    } catch {
      showToast('Erro ao renomear conversa.', 'error');
      setName(conversation.name);
    }
  };

  return (
    <div
      className={cn(
        'group rounded-m relative ml-7 flex min-h-[32px] cursor-pointer items-center justify-between py-1 pr-1 pl-2 text-left text-sm transition-colors',
        isActive
          ? 'bg-component-default text-text-white'
          : 'text-text-gray hover:bg-component-hover/50 hover:text-text-white',
      )}
      onClick={() => {
        if (!isEditing) {
          onSelectConversation(conversation.id);
          void navigate({ to: `/app/chat/${conversation.id}` });
        }
      }}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === 'Enter' || e.key === 'Space')) {
          onSelectConversation(conversation.id);
          void navigate({ to: `/app/chat/${conversation.id}` });
        }
      }}
      role="button"
      tabIndex={0}
    >
      {isEditing ? (
        <form
          className="w-full min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            void handleRename();
          }}
        >
          <input
            autoFocus
            className="text-text-white border-text-white w-full border-b bg-transparent outline-none"
            onBlur={() => {
              void handleRename();
            }}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onFocus={(e) => {
              e.target.select();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setName(conversation.name);
                setIsEditing(false);
              }
            }}
            value={name}
          />
        </form>
      ) : (
        <span className="min-w-0 flex-1 truncate pr-2">
          {conversation.name.trim() ? conversation.name : 'Conversa sem nome'}
        </span>
      )}

      {!isEditing && (
        <div className="-my-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <DropdownMenu
            items={[
              {
                icon: Edit2,
                label: 'Renomear',
                onClick: () => {
                  setIsEditing(true);
                },
              },
              {
                icon: Trash2,
                label: 'Excluir',
                onClick: () => {
                  onDeleteChat(conversation.id);
                },
                variant: 'destructive',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

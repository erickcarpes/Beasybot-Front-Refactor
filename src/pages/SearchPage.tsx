import { type ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import DataTable from '@/components/ui/DataTable';
import DropdownMenu from '@/components/ui/DropdownMenu';
import SearchBar from '@/components/ui/SearchBar';
import { useToast } from '@/contexts/toastContext';
import {
  BulkDeleteChatModal,
  type Chat,
  useDeleteChat,
  useDeleteChats,
  useGetAllChats,
} from '@/features/chat';
import { cn } from '@/utils/cn';

// ============================================================================
// Types
// ============================================================================

type ModalState = { type: 'BULK_DELETE' } | null;

// ============================================================================
// Component
// ============================================================================

export default function SearchPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  const { data: chats = [], isLoading } = useGetAllChats();
  const { mutateAsync: deleteChat } = useDeleteChat();
  const { isPending: isDeleteChatsPending, mutate: deleteChats } = useDeleteChats();
  const { showToast } = useToast();

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Handles the bulk deletion of selected chats.
   * Calls the mutation (with error/success hooks) and manages UI state.
   */
  const handleBulkDelete = () => {
    deleteChats(selectedChatIds, {
      onError: () => {
        showToast('Erro ao excluir conversas.', 'error');
      },
      onSuccess: () => {
        showToast('Conversas excluídas com sucesso!', 'success');
        setRowSelection({});
        setActiveModal(null);
      },
    });
  };

  /**
   * Handles the deletion of a single chat.
   * Memoized to prevent unnecessary re-renders of the table columns.
   */
  const handleSingleDelete = useCallback(
    async (id: string) => {
      await deleteChat(id, {
        onError: () => {
          showToast('Erro ao excluir conversa.', 'error');
        },
        onSuccess: () => {
          showToast('Conversa excluída com sucesso!', 'success');
        },
      });
    },
    [deleteChat, showToast],
  );

  const columns = useMemo<ColumnDef<Chat>[]>(
    () => [
      {
        cell: ({ row }) => (
          <div className="flex justify-center">
            <input
              checked={row.getIsSelected()}
              className="checked:bg-brand accent-brand size-4 cursor-pointer rounded checked:border-transparent focus:ring-0"
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              type="checkbox"
            />
          </div>
        ),
        header: ({ table }) => (
          <div className="flex justify-center">
            <input
              checked={table.getIsAllPageRowsSelected()}
              className="checked:bg-brand accent-brand size-4 cursor-pointer rounded checked:border-transparent focus:ring-0"
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              type="checkbox"
            />
          </div>
        ),
        id: 'select',
      },
      {
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3 pr-10 md:pr-0">
            <div className="bg-brand/10 flex size-10 items-center justify-center rounded-lg md:hidden">
              <span className="text-brand font-bold uppercase">{row.original.name.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-1 cursor-pointer truncate font-medium">
                {row.original.name}
              </span>
              <span className="text-text-2 text-xs md:hidden">
                {new Date(row.original.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ),
        header: 'Nome',
      },
      {
        accessorKey: 'updatedAt',
        cell: ({ row }) => (
          <div className="text-text-2 text-sm">
            {new Date(row.original.updatedAt).toLocaleDateString()} •{' '}
            {new Date(row.original.updatedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        ),
        header: 'Atualizado em',
      },
      {
        accessorKey: 'origin',
        cell: ({ row }) => (
          <div>
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                row.original.origin === 'WHATSAPP'
                  ? 'border-green-500/20 bg-green-500/10 text-green-500'
                  : 'border-blue-500/20 bg-blue-500/10 text-blue-500',
              )}
            >
              {row.original.origin === 'WHATSAPP' ? 'WhatsApp' : 'Web'}
            </span>
          </div>
        ),
        header: 'Origem',
      },
      {
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu
              items={[
                {
                  icon: Edit2,
                  label: 'Renomear',
                  onClick: () => {
                    // Implement rename
                  },
                },
                {
                  icon: Trash2,
                  label: 'Excluir',
                  onClick: () => {
                    void handleSingleDelete(row.original.id);
                  },
                  variant: 'destructive',
                },
              ]}
            />
          </div>
        ),
        header: () => <div className="text-center">Ações</div>,
        id: 'actions',
      },
    ],
    [handleSingleDelete],
  );

  const selectedChatIds = Object.keys(rowSelection);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex min-h-full w-full flex-col px-4 py-8 md:px-8 lg:py-12">
        <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-subtitle-m text-text-white font-semibold">Minhas conversas</h1>
              <p className="text-body-s text-text-2 mt-1">Gerencie suas conversas e históricos</p>
            </div>

            <div className="flex w-full items-center gap-4 md:w-auto">
              {selectedChatIds.length > 0 && (
                <button
                  className="bg-fail-error/10 text-fail-error hover:bg-fail-error/20 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
                  onClick={() => {
                    setActiveModal({ type: 'BULK_DELETE' });
                  }}
                  type="button"
                >
                  <Trash2 size={18} />
                  Excluir ({selectedChatIds.length})
                </button>
              )}

              <div className="relative w-full md:w-[320px]">
                <SearchBar onSearch={setGlobalFilter} placeholder="Buscar conversa..." />
              </div>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={chats}
            emptyMessage="Nenhuma conversa encontrada."
            getRowId={(row) => row.id}
            globalFilter={globalFilter}
            isLoading={isLoading}
            onGlobalFilterChange={setGlobalFilter}
            onRowSelectionChange={setRowSelection}
            rowSelection={rowSelection}
          />
        </div>
      </div>

      <BulkDeleteChatModal
        ids={selectedChatIds}
        isOpen={activeModal?.type === 'BULK_DELETE'}
        isPending={isDeleteChatsPending}
        onClose={handleCloseModal}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}

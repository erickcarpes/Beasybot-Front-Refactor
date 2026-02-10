import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit2, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import DropdownMenu from '@/components/ui/DropdownMenu';
import SearchBar from '@/components/ui/SearchBar';
import { BulkDeleteChatModal, type Chat, useGetAllChats } from '@/features/chat';
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

  const columns = useMemo<ColumnDef<Chat>[]>(
    () => [
      {
        cell: ({ row }) => (
          <div className="flex justify-center">
            <input
              checked={row.getIsSelected()}
              className="border-stroke-2 bg-component-pressed checked:bg-brand accent-brand size-4 cursor-pointer rounded checked:border-transparent focus:ring-0"
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
              className="border-stroke-2 bg-component-pressed checked:bg-brand accent-brand size-4 cursor-pointer rounded checked:border-transparent focus:ring-0"
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
        cell: () => (
          <div className="flex justify-end">
            <DropdownMenu
              items={[
                {
                  icon: Edit2,
                  label: 'Renomear',
                  onClick: () => {}, // TODO: Re-implement when modal is ready
                },
                {
                  icon: Trash2,
                  label: 'Excluir',
                  onClick: () => {}, // TODO: Re-implement when modal is ready
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
    [],
  );

  const table = useReactTable({
    columns,
    data: chats,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter,
      rowSelection,
    },
  });

  const selectedChatIds = Object.keys(rowSelection);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleBulkDeleteSuccess = () => {
    setRowSelection({});
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-text-2 flex h-64 items-center justify-center">Carregando...</div>;
    }

    if (chats.length === 0) {
      return (
        <div className="text-text-2 flex h-64 flex-col items-center justify-center gap-2">
          <Search className="opacity-50" size={32} />
          <p>Nenhuma conversa encontrada.</p>
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-stroke-2 bg-component-default border-b" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="text-text-2 px-6 py-4 text-sm font-medium whitespace-nowrap"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-stroke-2 divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr
                className={cn(
                  'group hover:bg-component-hover/20 transition-colors',
                  row.getIsSelected() && 'bg-brand/5 hover:bg-brand/10',
                )}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-6 py-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto px-4 py-8 md:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-[1200px]">
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

        {/* Table / List */}
        <div className="bg-component-default border-stroke-2 min-h-[400px] overflow-hidden rounded-xl border">
          {renderContent()}
        </div>
      </div>

      <BulkDeleteChatModal
        ids={selectedChatIds}
        isOpen={activeModal?.type === 'BULK_DELETE'}
        onClose={handleCloseModal}
        onSuccess={handleBulkDeleteSuccess}
      />
    </div>
  );
}

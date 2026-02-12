import { type ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import DropdownMenu from '@/components/ui/DropdownMenu';
import SearchBar from '@/components/ui/SearchBar';
import { useCurrentUser } from '@/contexts/user/userContext';
import {
  BulkDeleteFilesModal,
  CreateFileModal,
  useFileModal,
  useFilesPage,
} from '@/features/files';
import { useFileAttachments } from '@/hooks/useFileAttachments';
import { type IFile as File } from '@/services/beasybox-api/files';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/fileUtils';

// ============================================================================
// Component
// ============================================================================

export default function KnowledgePage() {
  const user = useCurrentUser();
  const {
    files,
    globalFilter,
    handleBulkDelete,
    handleCreateFiles,
    handleSingleDelete,
    isCreateFilesPending,
    isDeleteFilesPending,
    isLoading,
    rowSelection,
    selectedFileIds,
    setGlobalFilter,
    setRowSelection,
  } = useFilesPage({ userId: user.id });

  const { activeModal, closeModal, openModal } = useFileModal();

  const {
    addFiles,
    clearFiles,
    dragHandlers,
    files: attachedFiles,
    isDragging,
    removeFile,
  } = useFileAttachments();

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleCloseModal = () => {
    closeModal();
    clearFiles();
  };

  const onSubmitCreateFiles = async () => {
    await handleCreateFiles(attachedFiles, handleCloseModal);
  };

  const onSubmitBulkDelete = () => {
    handleBulkDelete(handleCloseModal);
  };

  const columns = useMemo<ColumnDef<File>[]>(
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
            {/* Placeholder icon, could change based on file type */}
            <div className="bg-brand/10 flex size-10 items-center justify-center rounded-lg md:hidden">
              <span className="text-brand font-bold uppercase">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-1 cursor-pointer truncate font-medium">
                {row.original.name}
              </span>
              <span className="text-text-2 text-xs md:hidden">
                {new Date(row.original.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ),
        header: 'Nome',
      },
      {
        accessorKey: 'size',
        cell: ({ row }) => (
          <div className="text-text-2 text-sm">{formatFileSize(row.original.size)}</div>
        ),
        header: 'Tamanho',
      },
      {
        accessorKey: 'createdAt',
        cell: ({ row }) => (
          <div className="text-text-2 text-sm">
            {new Date(row.original.createdAt).toLocaleDateString()} •{' '}
            {new Date(row.original.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        ),
        header: 'Data',
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

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex min-h-full w-full flex-col px-4 py-8 md:px-8 lg:py-12">
        <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-subtitle-m text-text-white font-semibold">Meus arquivos</h1>
              <p className="text-body-s text-text-2 mt-1">Gerencie seus arquivos e documentos</p>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              {selectedFileIds.length > 0 ? (
                <button
                  className="bg-fail-error/10 text-fail-error hover:bg-fail-error/20 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
                  onClick={() => {
                    openModal('BULK_DELETE');
                  }}
                  type="button"
                >
                  <Trash2 size={18} />
                  Excluir ({selectedFileIds.length})
                </button>
              ) : null}

              <div className="relative w-full sm:w-[320px]">
                <SearchBar onSearch={setGlobalFilter} placeholder="Buscar arquivo..." />
              </div>

              <Button
                className="hidden md:flex"
                onClick={() => {
                  openModal('CREATE_FILE');
                }}
                size="medium"
                variant="primary"
              >
                Adicionar arquivos
              </Button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={files}
            emptyMessage="Nenhum arquivo encontrado."
            getRowId={(row) => row.id}
            globalFilter={globalFilter}
            isLoading={isLoading}
            onGlobalFilterChange={setGlobalFilter}
            onRowSelectionChange={setRowSelection}
            rowSelection={rowSelection}
          />
        </div>
      </div>

      <BulkDeleteFilesModal
        ids={selectedFileIds}
        isOpen={activeModal === 'BULK_DELETE'}
        isPending={isDeleteFilesPending}
        onClose={handleCloseModal}
        onConfirm={onSubmitBulkDelete}
      />

      <CreateFileModal
        dragHandlers={dragHandlers}
        files={attachedFiles}
        isDragging={isDragging}
        isOpen={activeModal === 'CREATE_FILE'}
        isPending={isCreateFilesPending}
        onAddFiles={(fileList) => {
          addFiles(fileList);
        }}
        onClose={handleCloseModal}
        onRemoveFile={removeFile}
        onSubmit={() => {
          void onSubmitCreateFiles();
        }}
      />
    </div>
  );
}

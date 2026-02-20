import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  type RowSelectionState,
  type Updater,
  useReactTable,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { cn } from '@/utils/cn';

import DataTableSkeleton from './DataTableSkeleton';

interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
  readonly emptyMessage?: string;
  readonly getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  readonly globalFilter?: string;
  readonly isLoading?: boolean;
  readonly onGlobalFilterChange?: (value: string) => void;
  readonly onRowClick?: (row: TData) => void;
  readonly onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
  readonly rowSelection?: RowSelectionState;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = 'Nenhum dado encontrado.',
  getRowId,
  globalFilter,
  isLoading,
  onGlobalFilterChange,
  onRowClick,
  onRowSelectionChange,
  rowSelection = {},
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId,
    onGlobalFilterChange,
    onRowSelectionChange,
    state: {
      globalFilter,
      rowSelection,
    },
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <div className="border-stroke-2 bg-component-default text-text-2 flex h-full flex-col items-center justify-center gap-2 rounded-xl border">
        <Search className="opacity-50" size={32} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border-stroke-2 bg-component-default flex flex-1 flex-col overflow-hidden rounded-xl border">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-component-default sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-stroke-2 border-b" key={headerGroup.id}>
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
          <tbody className="divide-stroke-3 divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr
                className={cn(
                  'group hover:bg-component-hover/20 transition-colors',
                  row.getIsSelected() && 'bg-brand/5 hover:bg-brand/10',
                  onRowClick && 'cursor-pointer',
                )}
                key={row.id}
                onClick={() => {
                  onRowClick?.(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-6 py-3.5" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

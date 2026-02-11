import { cn } from '@/utils/cn';

interface DataTableSkeletonProps {
  readonly columnCount?: number;
  readonly rowCount?: number;
}

export default function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
}: DataTableSkeletonProps) {
  return (
    <div className="border-stroke-2 bg-component-default w-full animate-pulse overflow-hidden rounded-xl border">
      <div className="border-stroke-2 bg-component-default/50 border-b">
        <div className="flex items-center gap-4 px-6 py-4">
          {Array.from({ length: columnCount }).map((_, index) => (
            <div
              className={cn('bg-component-hover/50 h-4 rounded', index === 0 ? 'w-8' : 'flex-1')}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="divide-stroke-3 divide-y">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div className="flex items-center gap-4 px-6 py-4" key={rowIndex}>
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <div
                className={cn(
                  'bg-component-hover/30 h-4 rounded',
                  colIndex === 0 ? 'w-4' : 'flex-1',
                )}
                key={colIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

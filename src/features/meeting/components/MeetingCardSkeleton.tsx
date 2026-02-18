interface MeetingCardSkeletonProps {
  readonly count?: number;
}

export default function MeetingCardSkeleton({ count = 3 }: MeetingCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="border-stroke-2 bg-components flex h-full animate-pulse flex-col justify-between rounded-2xl border p-5"
          key={index}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-4">
            <div className="bg-component-hover/50 h-5 w-3/5 rounded" />
            <div className="bg-component-hover/50 h-6 w-20 rounded-full" />
          </div>

          {/* Meta rows */}
          <div className="flex flex-col gap-2.5 pb-4">
            <div className="flex items-center gap-2">
              <div className="bg-component-hover/30 size-3.5 rounded-full" />
              <div className="bg-component-hover/30 h-3 w-2/3 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-component-hover/30 size-3.5 rounded-full" />
              <div className="bg-component-hover/30 h-3 w-1/3 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-component-hover/30 size-3.5 rounded-full" />
              <div className="bg-component-hover/30 h-3 w-1/4 rounded" />
            </div>
          </div>

          {/* Divider */}
          <div className="bg-component-hover/30 h-px w-full" />

          {/* Summary lines */}
          <div className="flex flex-col gap-2 pt-4">
            <div className="bg-component-hover/30 h-3 w-full rounded" />
            <div className="bg-component-hover/30 h-3 w-5/6 rounded" />
            <div className="bg-component-hover/30 h-3 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

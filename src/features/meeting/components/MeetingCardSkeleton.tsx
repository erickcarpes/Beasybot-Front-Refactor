interface MeetingCardSkeletonProps {
  readonly count?: number;
}

export default function MeetingCardSkeleton({ count = 3 }: MeetingCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="component-gradient border-border-dark-gray relative flex animate-pulse flex-col rounded-2xl border p-5"
          key={index}
        >
          {/* Header: Logo + Status + Menu */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Box */}
              <div className="bg-component-hover/20 size-9 rounded-lg" />
              {/* Status Badge */}
              <div className="bg-component-hover/20 h-6 w-24 rounded-full" />
            </div>
            {/* Menu */}
            <div className="bg-component-hover/20 size-6 rounded-md" />
          </div>

          {/* Title */}
          <div className="bg-component-hover/40 mb-3 h-6 w-3/4 rounded" />

          {/* Summary */}
          <div className="mb-6 flex flex-col gap-2">
            <div className="bg-component-hover/20 h-3 w-full rounded" />
            <div className="bg-component-hover/20 h-3 w-5/6 rounded" />
          </div>

          {/* Footer Grid */}
          <div className="border-component-hover/10 mt-auto grid grid-cols-2 gap-x-2 gap-y-3 border-t pt-4">
            {/* Date */}
            <div className="flex items-center gap-2">
              <div className="bg-component-hover/20 size-3 rounded-full" />
              <div className="bg-component-hover/20 h-2 w-16 rounded" />
            </div>
            {/* Duration */}
            <div className="flex items-center gap-2">
              <div className="bg-component-hover/20 size-3 rounded-full" />
              <div className="bg-component-hover/20 h-2 w-12 rounded" />
            </div>
            {/* Participants */}
            <div className="col-span-2 flex items-center gap-2">
              <div className="bg-component-hover/20 size-3 rounded-full" />
              <div className="bg-component-hover/20 h-2 w-32 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

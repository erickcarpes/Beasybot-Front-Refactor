export default function MessageSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-4">
      {/* Bot message skeleton */}
      <div className="flex w-full items-start gap-3">
        <div className="bg-component-pressed h-8 w-8 shrink-0 rounded-full" />
        <div className="flex w-full max-w-[80%] flex-col gap-2">
          <div className="bg-component-pressed h-4 w-3/4 rounded" />
          <div className="bg-component-pressed h-4 w-1/2 rounded" />
        </div>
      </div>

      {/* User message skeleton */}
      <div className="flex w-full items-end justify-end gap-3">
        <div className="flex w-full max-w-[80%] flex-col items-end gap-2">
          <div className="bg-component-pressed h-4 w-2/3 rounded" />
        </div>
        <div className="bg-component-pressed h-8 w-8 shrink-0 rounded-full" />
      </div>
      {/* Bot message skeleton 2*/}
      <div className="flex w-full items-start gap-3">
        <div className="bg-component-pressed h-8 w-8 shrink-0 rounded-full" />
        <div className="flex w-full max-w-[80%] flex-col gap-2">
          <div className="bg-component-pressed h-4 w-5/6 rounded" />
          <div className="bg-component-pressed h-4 w-2/3 rounded" />
          <div className="bg-component-pressed h-4 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}

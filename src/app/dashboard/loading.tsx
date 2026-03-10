function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-3xl bg-zinc-200/70 dark:bg-zinc-800/70 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-28 rounded-full" />
          <SkeletonBlock className="h-14 w-72" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <div className="w-full md:w-72 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 p-6">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="mt-4 h-10 w-40" />
          <SkeletonBlock className="mt-4 h-3 w-full rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <SkeletonBlock className="h-10 w-10 rounded-2xl" />
              <SkeletonBlock className="h-12 w-56" />
              <SkeletonBlock className="h-10 w-10 rounded-2xl" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-5"
              >
                <div className="flex items-center gap-4">
                  <SkeletonBlock className="h-10 w-10 rounded-2xl" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-44" />
                    <SkeletonBlock className="h-3 w-24" />
                  </div>
                </div>
                <SkeletonBlock className="h-9 w-9 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 p-8">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-6 h-24 w-full" />
            <SkeletonBlock className="mt-6 h-3 w-36" />
          </div>
          <div className="rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 p-8">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="mt-4 h-8 w-52" />
            <div className="mt-6 flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


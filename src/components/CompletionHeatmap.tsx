"use client";

interface CompletionHeatmapPoint {
  date: string;
  completion: number;
}

function getHeatLevel(completion: number) {
  if (completion >= 80) return "bg-emerald-500";
  if (completion >= 60) return "bg-cyan-500";
  if (completion >= 40) return "bg-indigo-500";
  if (completion >= 20) return "bg-amber-400";
  if (completion > 0) return "bg-rose-400";
  return "bg-zinc-200 dark:bg-zinc-800";
}

export default function CompletionHeatmap({ data }: { data: CompletionHeatmapPoint[] }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
      {data.map((point) => (
        <div key={point.date} className="space-y-2">
          <div
            className={`h-10 rounded-2xl ${getHeatLevel(point.completion)} transition-transform hover:scale-105`}
            title={`${point.date}: ${point.completion}%`}
          />
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {point.date.slice(8)}
          </p>
        </div>
      ))}
    </div>
  );
}

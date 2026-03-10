interface Achievement {
  title: string;
  hint: string;
  unlocked: boolean;
}

export default function AchievementBoard({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {achievements.map((achievement) => (
        <div key={achievement.title} className={`rounded-[2rem] border p-5 ${achievement.unlocked ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/5" : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Achievement</p>
          <p className="mt-2 text-sm font-black text-zinc-900 dark:text-zinc-100">{achievement.title}</p>
          <p className="mt-2 text-xs text-zinc-500">{achievement.hint}</p>
          <p className={`mt-4 text-xs font-black uppercase tracking-[0.2em] ${achievement.unlocked ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-400"}`}>
            {achievement.unlocked ? "Unlocked" : "In Progress"}
          </p>
        </div>
      ))}
    </div>
  );
}


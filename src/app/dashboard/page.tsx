import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDemoHabitLogs, getDemoHabits } from "@/lib/habit-data";
import DashboardAIInsight, {
  DashboardAIInsightFallback,
} from "@/components/DashboardAIInsight";
import HabitList from "@/components/HabitList";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { date: givenDateParams } = await searchParams;
  const session: any = await getServerSession(authOptions);
  const isSubscribed = session?.user?.isSubscribed || false;
  const userId = session?.user?.id;
  const dateStr =
    typeof givenDateParams === "string" ? givenDateParams : format(new Date(), "yyyy-MM-dd");

  const [habits, logs] = userId
    ? isSubscribed
      ? await Promise.all([
          prisma.habit.findMany({
            where: { userId, isArchived: false },
            orderBy: { createdAt: "asc" },
          }),
          prisma.habitLog.findMany({
            where: {
              habit: { userId },
              date: dateStr,
            },
            select: {
              habitId: true,
              date: true,
              completed: true,
            },
          }),
        ])
      : [getDemoHabits(userId), getDemoHabitLogs(dateStr)]
    : [[], []];

  const habitCompletionStatus = logs.reduce<Record<string, boolean>>((acc, log) => {
    acc[log.habitId] = log.completed;
    return acc;
  }, {});

  const total = habits.length;
  const completed = logs.filter((log) => log.completed).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const parsedDate = new Date(`${dateStr}T12:00:00`);

  return (
    <div className="max-w-6xl mx-auto w-full animate-aura-reveal relative min-h-screen pb-20">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
              Protocol Active
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 italic">
            Aura Orbit
          </h1>
          <p className="text-sm font-medium text-zinc-400 max-w-md">
            Your structural intelligence, synchronized in real-time.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3 p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-indigo-50 dark:border-zinc-800/50 shadow-xl shadow-indigo-100/20 dark:shadow-none">
          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">
            Efficiency Index
          </span>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-indigo-600 dark:text-cyan-400">
              {progressPercent}%
            </span>
            <div className="w-40 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className="h-full aura-glow transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="text-lg font-black tracking-tight text-zinc-800 dark:text-zinc-200">
              Daily Directive
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              {format(parsedDate, "EEEE, d MMMM")}
            </span>
          </div>
          <HabitList
            habits={habits}
            completionStatus={habitCompletionStatus}
            currentDate={dateStr}
            isSubscribed={isSubscribed}
          />
        </div>

        <div className="space-y-8">
          <Suspense fallback={<DashboardAIInsightFallback habits={habits} logs={logs} />}>
            <DashboardAIInsight
              habits={habits}
              logs={logs}
              dateLabel={format(parsedDate, "EEEE, d MMMM yyyy")}
              isSubscribed={isSubscribed}
              userId={userId}
              dateStr={dateStr}
            />
          </Suspense>

          <div className="p-8 rounded-[3rem] bg-linear-to-br from-zinc-900 to-zinc-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-48 h-48 aura-glow opacity-30 rounded-full blur-3xl pointer-events-none" />
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">
              Weekly Goal
            </h4>
            <p className="text-xl font-bold leading-tight mb-6">
              Maintain 85% average across all habits.
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

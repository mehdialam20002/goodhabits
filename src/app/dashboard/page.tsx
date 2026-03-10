import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDemoHabitLogs, getDemoHabits } from "@/lib/habit-data";
import { buildDateRange, summarizeHabitPerformance } from "@/lib/habit-insights";
import DashboardAIInsight, {
  DashboardAIInsightFallback,
} from "@/components/DashboardAIInsight";
import DashboardCompanion from "@/components/DashboardCompanion";
import HabitList from "@/components/HabitList";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { Activity, Flame, Target } from "lucide-react";

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
  const recentDates = buildDateRange(dateStr, 7);

  const [habits, logs, recentLogs] = userId
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
          prisma.habitLog.findMany({
            where: {
              habit: { userId },
              date: { in: recentDates },
            },
            select: {
              habitId: true,
              date: true,
              completed: true,
            },
          }),
        ])
      : [getDemoHabits(userId), getDemoHabitLogs(dateStr), recentDates.flatMap((date) => getDemoHabitLogs(date))]
    : [[], [], []];

  const habitCompletionStatus = logs.reduce<Record<string, boolean>>((acc, log) => {
    acc[log.habitId] = log.completed;
    return acc;
  }, {});

  const total = habits.length;
  const completed = logs.filter((log) => log.completed).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const parsedDate = new Date(`${dateStr}T12:00:00`);
  const weeklySummary = summarizeHabitPerformance(habits, recentLogs, recentDates);
  const dashboardMetrics = [
    {
      label: "Live Streak",
      value: `${weeklySummary.streakDays}d`,
      hint:
        weeklySummary.streakDays > 0
          ? "Days with at least one completion"
          : "Complete one habit today to start a streak",
      icon: Flame,
    },
    {
      label: "Best Habit",
      value: weeklySummary.bestHabit?.title ?? "No leader yet",
      hint: weeklySummary.bestHabit
        ? `${weeklySummary.bestHabit.rate}% hit rate in the last 7 days`
        : "Track more days to find a winner",
      icon: Activity,
    },
    {
      label: "Needs Focus",
      value: weeklySummary.needsAttention?.title ?? "All clear",
      hint: weeklySummary.needsAttention
        ? `${weeklySummary.needsAttention.misses} miss${weeklySummary.needsAttention.misses === 1 ? "" : "es"} in the last 7 days`
        : "No weak habit detected yet",
      icon: Target,
    },
  ];

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10 relative z-10">
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

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {dashboardMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    {metric.label}
                  </span>
                </div>
                <p className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs font-medium text-zinc-500">{metric.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <DashboardCompanion
            completed={completed}
            total={total}
            progressPercent={progressPercent}
            streakDays={weeklySummary.streakDays}
          />

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

          <div className="p-6 md:p-8 rounded-[3rem] bg-linear-to-br from-zinc-900 to-zinc-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-48 h-48 aura-glow opacity-30 rounded-full blur-3xl pointer-events-none" />
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">
              Weekly Goal
            </h4>
            <p className="text-xl font-bold leading-tight mb-6">
              Maintain 85% average across all habits.
            </p>
            <p className="text-sm text-zinc-300 mb-6">
              Current 7-day average: {weeklySummary.average}%
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

          <div className="p-6 md:p-8 rounded-[3rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                Habit Radar
              </h4>
              <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400">
                Last 7 Days
              </span>
            </div>
            <div className="space-y-4">
              {weeklySummary.habitStats.slice(0, 4).map((habit) => (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{habit.title}</p>
                    <span className="text-xs font-black text-zinc-400">{habit.rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-cyan-400"
                      style={{ width: `${habit.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

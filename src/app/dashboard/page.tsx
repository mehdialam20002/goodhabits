import { authOptions } from "@/lib/auth";
import DashboardAIInsight, { DashboardAIInsightFallback } from "@/components/DashboardAIInsight";
import HabitList from "@/components/HabitList";
import prisma from "@/lib/db";
import { getDemoHabitLogs, getDemoHabits } from "@/lib/habit-data";
import { buildDateRange, summarizeHabitPerformance } from "@/lib/habit-insights";
import { format } from "date-fns";
import { Activity, ArrowUpRight, Flame, Target, Zap } from "lucide-react";
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
  const dateStr = typeof givenDateParams === "string" ? givenDateParams : format(new Date(), "yyyy-MM-dd");
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

  const heroStats = [
    {
      label: "Today",
      value: `${progressPercent}%`,
      note: `${completed}/${total} complete`,
      accent: "from-indigo-500 via-violet-500 to-cyan-400",
    },
    {
      label: "Streak",
      value: `${weeklySummary.streakDays}d`,
      note: weeklySummary.streakDays > 0 ? "momentum active" : "start today",
      accent: "from-amber-400 via-orange-500 to-rose-500",
    },
    {
      label: "Best Habit",
      value: weeklySummary.bestHabit?.title ?? "No leader",
      note: weeklySummary.bestHabit ? `${weeklySummary.bestHabit.rate}% hit rate` : "needs more data",
      accent: "from-emerald-400 via-teal-500 to-cyan-500",
    },
    {
      label: "Needs Attention",
      value: weeklySummary.needsAttention?.title ?? "All clear",
      note: weeklySummary.needsAttention ? `${weeklySummary.needsAttention.misses} misses` : "steady across habits",
      accent: "from-fuchsia-500 via-violet-500 to-indigo-500",
    },
  ];

  const metricCards = [
    {
      label: "Execution",
      value: `${progressPercent}%`,
      hint: "Today completion score",
      icon: Zap,
    },
    {
      label: "Live Streak",
      value: `${weeklySummary.streakDays} days`,
      hint: "Days with at least one completion",
      icon: Flame,
    },
    {
      label: "Weak Spot",
      value: weeklySummary.needsAttention?.title ?? "No clear issue",
      hint: "First thing to recover",
      icon: Target,
    },
    {
      label: "Best Flow",
      value: weeklySummary.bestHabit?.title ?? "No clear winner",
      hint: "Strongest current routine",
      icon: Activity,
    },
  ];

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-[110px]" />
        <div className="absolute right-[-6%] top-20 h-96 w-96 rounded-full bg-fuchsia-300/16 blur-[130px]" />
        <div className="absolute bottom-[-8%] left-[24%] h-80 w-80 rounded-full bg-indigo-300/16 blur-[120px]" />
      </div>

      <section className="rounded-[2.6rem] border border-zinc-200/70 bg-white/95 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.06)] dark:border-zinc-800/70 dark:bg-zinc-950/82 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white dark:bg-white dark:text-zinc-950">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Dashboard
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 md:text-6xl">
              Clear layout.
              <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent"> Better readability.</span>
              <br />
              Stronger daily control.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
              The main thing on this page is your task list. Everything else should support it, not compete with it. This version pushes the habits forward and keeps analytics and AI easier to scan.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="interactive-card rounded-[1.8rem] border border-zinc-200/70 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className={`h-1.5 rounded-full bg-linear-to-r ${stat.accent}`} />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{stat.label}</p>
                  <p className="mt-2 text-xl font-black leading-tight text-zinc-950 dark:text-zinc-50">{stat.value}</p>
                  <p className="mt-2 text-xs text-zinc-500">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <div className="interactive-card rounded-[2rem] bg-linear-to-br from-zinc-950 via-violet-950 to-indigo-900 p-6 text-white shadow-[0_24px_80px_rgba(17,24,39,0.22)]">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">Efficiency Index</p>
              <div className="mt-4 flex items-end gap-3">
                <p className="text-6xl font-black tracking-[-0.06em]">{progressPercent}</p>
                <p className="pb-2 text-xs font-black uppercase tracking-[0.22em] text-white/55">percent</p>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-linear-to-r from-fuchsia-400 via-violet-400 to-cyan-300" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">
                {completed} completed out of {total} total habits on {format(parsedDate, "d MMM yyyy")}.
              </p>
            </div>

            <div className="interactive-card rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/72">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Today</p>
              <p className="mt-3 text-2xl font-black text-zinc-950 dark:text-zinc-50">{format(parsedDate, "EEEE, d MMMM yyyy")}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Keep this page for execution. Timer, rituals, and other side tools now have dedicated spaces in the sidebar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-[2.6rem] border border-zinc-200/70 bg-white/96 p-4 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/82 md:p-6">
            <div className="mb-5 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Main Workspace</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">Today&apos;s Habits</h2>
              </div>
              <span className="rounded-full bg-zinc-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
                {format(parsedDate, "EEEE, d MMM")}
              </span>
            </div>
            <HabitList habits={habits} completionStatus={habitCompletionStatus} currentDate={dateStr} isSubscribed={isSubscribed} />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {metricCards.map((metric) => (
              <div key={metric.label} className="interactive-card rounded-[2rem] border border-zinc-200/70 bg-white/96 p-5 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/82">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">{metric.label}</p>
                </div>
                <p className="mt-5 text-2xl font-black leading-tight text-zinc-950 dark:text-zinc-50">{metric.value}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-500">{metric.hint}</p>
              </div>
            ))}
          </div>

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

          <div className="interactive-card rounded-[2.6rem] border border-zinc-200/70 bg-white/96 p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/82">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Habit Radar</p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Recent consistency</h3>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300">
                7 days
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {weeklySummary.habitStats.slice(0, 4).map((habit, index) => (
                <div key={habit.id} className="rounded-[1.6rem] border border-zinc-200/70 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">#{index + 1}</p>
                      <p className="mt-1 text-base font-black text-zinc-950 dark:text-zinc-50">{habit.title}</p>
                    </div>
                    <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">{habit.rate}%</p>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${index % 2 === 0 ? "bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400" : "bg-linear-to-r from-amber-400 via-orange-500 to-rose-500"}`}
                      style={{ width: `${habit.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import AnalyticsCharts from "@/components/AnalyticsCharts";
import AchievementBoard from "@/components/AchievementBoard";
import AnalyticsActions from "@/components/AnalyticsActions";
import CompletionHeatmap from "@/components/CompletionHeatmap";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDemoHabitLogs, getDemoHabits } from "@/lib/habit-data";
import { summarizeHabitPerformance } from "@/lib/habit-insights";
import { addDays, format, startOfMonth, startOfWeek, subDays, subMonths, subYears } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const RANGE_OPTIONS = [
  { key: "7d", label: "7D", days: 7, step: "day" as const },
  { key: "1m", label: "1M", days: 30, step: "day" as const },
  { key: "2m", label: "2M", days: 60, step: "week" as const },
  { key: "3m", label: "3M", days: 90, step: "week" as const },
  { key: "4m", label: "4M", days: 120, step: "week" as const },
  { key: "1y", label: "1Y", days: 365, step: "month" as const },
];

type RangeKey = (typeof RANGE_OPTIONS)[number]["key"];

function getRangeConfig(range: string | undefined) {
  return RANGE_OPTIONS.find((option) => option.key === range) ?? RANGE_OPTIONS[0];
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const weekParam = typeof resolvedSearchParams.week === "string" ? resolvedSearchParams.week : "0";
  const rangeParam = typeof resolvedSearchParams.range === "string" ? resolvedSearchParams.range : "7d";
  const offset = Number.parseInt(weekParam, 10) || 0;
  const range = getRangeConfig(rangeParam as RangeKey);
  const session: any = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const isSubscribed = session.user.isSubscribed || false;
  const anchorDate =
    range.key === "1y"
      ? subYears(new Date(), offset)
      : range.key === "4m"
        ? subMonths(new Date(), offset * 4)
        : range.key === "3m"
          ? subMonths(new Date(), offset * 3)
          : range.key === "2m"
            ? subMonths(new Date(), offset * 2)
            : subDays(new Date(), offset * range.days);

  const endDate = anchorDate;
  const startDate =
    range.key === "1y"
      ? subYears(endDate, 1)
      : range.key === "4m"
        ? subMonths(endDate, 4)
        : range.key === "3m"
          ? subMonths(endDate, 3)
          : range.key === "2m"
            ? subMonths(endDate, 2)
            : subDays(endDate, range.days - 1);

  const allDates = Array.from({ length: range.days }, (_, index) =>
    format(addDays(startDate, index), "yyyy-MM-dd"),
  );

  const [habits, rangeLogs] = isSubscribed
    ? await Promise.all([
        prisma.habit.findMany({
          where: { userId, isArchived: false },
          select: { id: true, title: true },
        }),
        prisma.habitLog.findMany({
          where: {
            habit: { userId },
            date: { in: allDates },
          },
          select: {
            habitId: true,
            date: true,
            completed: true,
          },
        }),
      ])
    : [
        getDemoHabits(userId).map((habit) => ({ id: habit.id, title: habit.title })),
        allDates.flatMap((date) => getDemoHabitLogs(date)),
      ];

  const totalHabits = habits.length;
  const completionByDate = rangeLogs.reduce<Record<string, number>>((acc, log) => {
    if (log.completed) {
      acc[log.date] = (acc[log.date] || 0) + 1;
    }
    return acc;
  }, {});

  const daySeries = allDates.map((date) => ({
    date,
    count: completionByDate[date] || 0,
    completion: totalHabits > 0 ? Math.round(((completionByDate[date] || 0) / totalHabits) * 100) : 0,
  }));

  const groupedMap = new Map<string, { label: string; count: number; points: number }>();

  for (const point of daySeries) {
    const date = new Date(`${point.date}T12:00:00`);
    const bucketKey =
      range.step === "month"
        ? format(startOfMonth(date), "yyyy-MM")
        : range.step === "week"
          ? format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
          : point.date;
    const label =
      range.step === "month"
        ? format(date, "MMM yy")
        : range.step === "week"
          ? format(startOfWeek(date, { weekStartsOn: 1 }), "d MMM")
          : format(date, range.key === "1m" ? "d MMM" : "EEE");

    const current = groupedMap.get(bucketKey) ?? { label, count: 0, points: 0 };
    current.count += point.count;
    current.points += 1;
    groupedMap.set(bucketKey, current);
  }

  const chartData = Array.from(groupedMap.values()).map((group) => ({
    name: group.label,
    count: group.count,
    completion: totalHabits > 0 ? Math.round((group.count / (totalHabits * group.points)) * 100) : 0,
  }));

  const totalCompletions = daySeries.reduce((sum, point) => sum + point.count, 0);
  const averageCompletion =
    totalHabits > 0 ? Math.round((totalCompletions / (totalHabits * daySeries.length)) * 100) : 0;
  const summary = summarizeHabitPerformance(habits, rangeLogs, allDates);
  const leaderboard = [...summary.habitStats].sort((a, b) => b.rate - a.rate || b.completions - a.completions);
  const heatmapData = daySeries.slice(-30).map((point) => ({
    date: point.date,
    completion: point.completion,
  }));
  const streakDays = summary.streakDays;
  const rangeLabel = `${format(startDate, "d MMM yyyy")} - ${format(endDate, "d MMM yyyy")}`;
  const monthlyReview = {
    strongest: leaderboard[0]?.title ?? "No data yet",
    weakest: [...leaderboard].reverse()[0]?.title ?? "No data yet",
    average: averageCompletion,
    streak: streakDays,
  };
  const achievements = [
    { title: "7-Day Pulse", hint: "Hit at least one habit for 7 straight days.", unlocked: streakDays >= 7 },
    { title: "80% Operator", hint: "Average 80%+ completion in the active range.", unlocked: averageCompletion >= 80 },
    { title: "Recovery Artist", hint: "Keep weakest habit above 40%.", unlocked: ([...leaderboard].reverse()[0]?.rate ?? 0) >= 40 },
    { title: "Top 3 Control", hint: "Get three habits above 70%.", unlocked: leaderboard.slice(0, 3).every((habit) => habit.rate >= 70) },
  ];
  const summaryText = `Range ${range.label}: ${averageCompletion}% average completion. Best habit: ${monthlyReview.strongest}. Needs attention: ${monthlyReview.weakest}. Current streak: ${streakDays} days.`;

  return (
    <div className="max-w-6xl mx-auto w-full px-1 sm:px-0 animate-aura-reveal opacity-0" style={{ animationFillMode: "forwards" }}>
      <header className="mb-10 flex flex-col gap-6 stagger-1">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 text-aura">Aura Analytics</h1>
            <p className="text-zinc-500 font-medium">Deep dive into your mindful consistency.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Link
              href={`/dashboard/analytics?range=${range.key}&week=${offset + 1}`}
              prefetch
              className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold px-4 text-zinc-600 dark:text-zinc-400">{rangeLabel}</span>
            <Link
              href={`/dashboard/analytics?range=${range.key}&week=${Math.max(offset - 1, 0)}`}
              prefetch
              className={`p-2 rounded-xl transition-all shadow-sm ${
                offset === 0 ? "pointer-events-none opacity-40" : "hover:bg-white dark:hover:bg-zinc-800"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {RANGE_OPTIONS.map((option) => {
            const isActive = option.key === range.key;

            return (
              <Link
                key={option.key}
                href={`/dashboard/analytics?range=${option.key}&week=0`}
                prefetch
                className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-cyan-500"
                    : "border border-zinc-200 bg-white text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:text-cyan-400"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
        <AnalyticsActions
          title="Aura Analytics Summary"
          summary={summaryText}
          payload={{
            rangeLabel,
            averageCompletion,
            strongestHabit: monthlyReview.strongest,
            weakestHabit: monthlyReview.weakest,
            streakDays,
            topHabits: leaderboard.slice(0, 5).map((habit) => ({
              title: habit.title,
              rate: habit.rate,
              completions: habit.completions,
            })),
            achievements: achievements.map((achievement) => ({
              title: achievement.title,
              unlocked: achievement.unlocked,
            })),
          }}
        />
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow stagger-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
            Average Completion
          </h3>
          <p className="text-5xl font-black text-zinc-900 dark:text-zinc-50 italic">{averageCompletion}%</p>
          <p className="text-xs text-emerald-600 mt-4 font-black uppercase tracking-widest">Range: {range.label}</p>
        </div>
        <div className="p-6 rounded-3xl glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow">
          <h3 className="text-sm font-semibold text-zinc-500 mb-1">Total Habits Tracked</h3>
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{totalHabits}</p>
          <p className="text-xs text-zinc-500 mt-2">Active routines</p>
        </div>
        <div className="p-6 rounded-3xl glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-600 mb-1">Current Streak</h3>
          <p className="text-4xl font-bold">{streakDays} Days</p>
          <p className="text-xs mt-2 opacity-80">Track patterns across bigger windows.</p>
        </div>
      </div>

      <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow stagger-3">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-black tracking-tight">Consistency Curve</h3>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            {range.step === "day" ? "Daily view" : range.step === "week" ? "Weekly view" : "Monthly view"}
          </p>
        </div>
        <AnalyticsCharts
          data={chartData}
          habitBreakdown={leaderboard.slice(0, 5).map((habit) => ({
            title: habit.title,
            rate: habit.rate,
            completions: habit.completions,
          }))}
          averageCompletion={averageCompletion}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tight">Monthly Review</h3>
              <p className="text-sm text-zinc-500">One glance summary of what is winning and what needs rescue.</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Review block</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              ["Strongest Habit", monthlyReview.strongest],
              ["Needs Attention", monthlyReview.weakest],
              ["Average", `${monthlyReview.average}%`],
              ["Streak", `${monthlyReview.streak} days`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                <p className="mt-3 text-sm font-black text-zinc-900 dark:text-zinc-100">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tight">30-Day Heatmap</h3>
              <p className="text-sm text-zinc-500">Fast visual scan of your recent completion intensity.</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Recent momentum</span>
          </div>
          <CompletionHeatmap data={heatmapData} />
        </div>

        <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tight">Achievement Board</h3>
              <p className="text-sm text-zinc-500">Milestones that make consistency feel rewarding.</p>
            </div>
          </div>
          <AchievementBoard achievements={achievements} />
        </div>

        <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black tracking-tight">Top Habits</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {range.label} range
            </span>
          </div>
          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((habit, index) => (
              <div key={habit.id} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">#{index + 1}</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">{habit.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600 dark:text-cyan-400">{habit.rate}%</p>
                    <p className="text-xs text-zinc-500">{habit.completions} completions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black tracking-tight">Attention Queue</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Recovery first</span>
          </div>
          <div className="space-y-4">
            {[...leaderboard].reverse().slice(0, 5).map((habit) => (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{habit.title}</p>
                  <span className="text-xs font-black text-zinc-400">{habit.misses} misses</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-rose-500 to-amber-400"
                    style={{ width: `${Math.max(8, habit.rate)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Recover this habit first if you want the fastest overall score lift.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

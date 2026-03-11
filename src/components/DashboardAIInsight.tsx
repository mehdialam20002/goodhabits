import { getAIInsight } from "@/lib/ai";
import type { HabitLogSnapshot, HabitSnapshot } from "@/lib/habit-data";
import prisma from "@/lib/db";
import { format, subDays } from "date-fns";
import { Sparkles } from "lucide-react";

interface DashboardAIInsightProps {
  habits: HabitSnapshot[];
  logs: HabitLogSnapshot[];
  dateLabel: string;
  isSubscribed: boolean;
  userId?: string;
  dateStr: string;
}

function buildInstantInsight(habits: HabitSnapshot[], logs: HabitLogSnapshot[]) {
  const total = habits.length;

  if (total === 0) {
    return "Add your first habit to start tracking daily consistency.";
  }

  const completed = logs.filter((log) => log.completed).length;
  const completionRate = Math.round((completed / total) * 100);

  if (completionRate >= 80) {
    return `Insight: ${completed}/${total} habits are complete. Your system is stable today.\nAction: Protect this momentum by finishing the remaining tasks early.`;
  }

  if (completionRate >= 50) {
    return `Insight: ${completed}/${total} habits are done. Consistency is decent but uneven.\nAction: Finish one small pending habit now to push the day back into control.`;
  }

  return `Insight: Only ${completed}/${total} habits are complete so far. The day is slipping.\nAction: Pick the easiest habit and close it immediately to restart momentum.`;
}

function InsightCard({ insight, pending = false }: { insight: string; pending?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2.75rem] border border-indigo-200/60 bg-linear-to-br from-fuchsia-500 via-violet-600 to-indigo-700 p-[1px] shadow-[0_24px_90px_rgba(99,102,241,0.22)]">
      <div className="rounded-[2.7rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(248,250,252,0.88)_50%,_rgba(241,245,249,0.95)_100%)] p-7 dark:bg-[radial-gradient(circle_at_top_left,_rgba(24,24,27,0.96),_rgba(9,9,11,0.92)_50%,_rgba(15,23,42,0.96)_100%)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-white shadow-lg">
            <Sparkles className={`h-5 w-5 ${pending ? "animate-aura-pulse" : ""}`} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-cyan-300">AI Synthesis</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">{pending ? "Preparing live analysis" : "Sharper context for your next move"}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/60 bg-white/70 p-5 dark:border-zinc-800/70 dark:bg-zinc-950/60">
          <p className="whitespace-pre-line text-[1.05rem] font-bold leading-9 text-zinc-900 dark:text-zinc-100">{insight}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">{pending ? "Fallback mode" : "Gemini-Aura engine"}</p>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-fuchsia-500 via-violet-500 to-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardAIInsightFallback({
  habits,
  logs,
}: Pick<DashboardAIInsightProps, "habits" | "logs">) {
  return <InsightCard insight={buildInstantInsight(habits, logs)} pending />;
}

export default async function DashboardAIInsight({
  habits,
  logs,
  dateLabel,
  isSubscribed,
  userId,
  dateStr,
}: DashboardAIInsightProps) {
  if (!isSubscribed) {
    return <InsightCard insight="Upgrade to Pro to unlock live AI-generated habit analysis for each day." />;
  }

  if (habits.length === 0) {
    return <InsightCard insight="Add your first habit to unlock a personalized performance analysis." />;
  }

  const completed = logs.filter((log) => log.completed).length;
  const completionRate = Math.round((completed / habits.length) * 100);
  const completedSet = new Set(logs.filter((log) => log.completed).map((log) => log.habitId));
  const missedHabits = habits.filter((habit) => !completedSet.has(habit.id)).map((habit) => habit.title);
  const completedHabits = habits.filter((habit) => completedSet.has(habit.id)).map((habit) => habit.title);
  const recentDates = Array.from({ length: 7 }, (_, index) =>
    format(subDays(new Date(`${dateStr}T12:00:00`), 6 - index), "yyyy-MM-dd"),
  );

  let weeklyAverage = completionRate;
  let trend = "stable";
  let streakDays = completed > 0 ? 1 : 0;

  if (userId) {
    const recentLogs = await prisma.habitLog.findMany({
      where: {
        habit: { userId },
        date: { in: recentDates },
      },
      select: {
        date: true,
        completed: true,
        habitId: true,
      },
    });

    const completionByDate = recentLogs.reduce<Record<string, number>>((acc, log) => {
      if (log.completed) acc[log.date] = (acc[log.date] || 0) + 1;
      return acc;
    }, {});

    const dailyRates = recentDates.map((date) =>
      habits.length > 0 ? Math.round(((completionByDate[date] || 0) / habits.length) * 100) : 0,
    );

    weeklyAverage = Math.round(dailyRates.reduce((sum, rate) => sum + rate, 0) / dailyRates.length);
    const firstHalf = Math.round((dailyRates[0] + dailyRates[1] + dailyRates[2]) / 3);
    const secondHalf = Math.round((dailyRates[4] + dailyRates[5] + dailyRates[6]) / 3);
    trend = secondHalf - firstHalf >= 10 ? "improving" : firstHalf - secondHalf >= 10 ? "declining" : "stable";

    streakDays = 0;
    for (let index = recentDates.length - 1; index >= 0; index -= 1) {
      const date = recentDates[index];
      if ((completionByDate[date] || 0) > 0) streakDays += 1;
      else break;
    }
  }

  const prompt = `Selected date: ${dateLabel}.
Total habits: ${habits.length}.
Completed today: ${completed}/${habits.length} (${completionRate}%).
Weekly average: ${weeklyAverage}%.
Recent trend: ${trend}.
Current streak estimate: ${streakDays} day(s).
Completed habits today: ${completedHabits.length > 0 ? completedHabits.join(", ") : "none"}.
Missed habits today: ${missedHabits.length > 0 ? missedHabits.join(", ") : "none"}.
Give the most useful analysis and next-step suggestions possible.`;
  const aiAnalysis = await getAIInsight(prompt);

  return <InsightCard insight={aiAnalysis} />;
}

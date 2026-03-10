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
    <div className="p-8 rounded-[3rem] glass-card border-indigo-50/50 dark:border-zinc-800/50 relative overflow-hidden group min-h-[260px]">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 aura-glow opacity-10 rounded-full blur-2xl transition-all group-hover:opacity-20" />
      <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-indigo-600 dark:text-cyan-400 mb-6 flex items-center gap-3">
        <Sparkles className={`w-4 h-4 ${pending ? "animate-aura-pulse" : ""}`} />
        AI Synthesis
      </h3>
      <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed italic border-l-4 border-indigo-600 dark:border-cyan-400 pl-6 py-2 whitespace-pre-line">
        {insight}
      </p>
      <div className="mt-8 pt-6 border-t border-indigo-50/50 dark:border-zinc-800/50">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-400">
          {pending ? "Preparing analysis" : "Processing via Gemini-Aura Engine"}
        </p>
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
    return (
      <InsightCard insight="Upgrade to Pro to unlock live AI-generated habit analysis for each day." />
    );
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
      if (log.completed) {
        acc[log.date] = (acc[log.date] || 0) + 1;
      }
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
      if ((completionByDate[date] || 0) > 0) {
        streakDays += 1;
      } else {
        break;
      }
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

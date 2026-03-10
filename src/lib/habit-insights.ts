import type { Habit } from "@prisma/client";
import { addDays, format, subDays } from "date-fns";
import type { HabitLogSnapshot } from "@/lib/habit-data";

export function buildDateRange(endDate: string, days: number) {
  const end = new Date(`${endDate}T12:00:00`);
  return Array.from({ length: days }, (_, index) =>
    format(addDays(subDays(end, days - 1), index), "yyyy-MM-dd"),
  );
}

export function calculateStreakDays(dates: string[], completionByDate: Record<string, number>) {
  let streak = 0;

  for (let index = dates.length - 1; index >= 0; index -= 1) {
    if ((completionByDate[dates[index]] || 0) > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function summarizeHabitPerformance(
  habits: Pick<Habit, "id" | "title">[],
  logs: HabitLogSnapshot[],
  dates: string[],
) {
  const completedByDate = logs.reduce<Record<string, number>>((acc, log) => {
    if (log.completed) {
      acc[log.date] = (acc[log.date] || 0) + 1;
    }
    return acc;
  }, {});

  const habitStats = habits.map((habit) => {
    const completions = logs.filter((log) => log.habitId === habit.id && log.completed).length;
    const rate = dates.length > 0 ? Math.round((completions / dates.length) * 100) : 0;

    return {
      id: habit.id,
      title: habit.title,
      completions,
      rate,
      misses: Math.max(dates.length - completions, 0),
    };
  });

  const sortedByRate = [...habitStats].sort((a, b) => b.rate - a.rate || b.completions - a.completions);
  const bestHabit = sortedByRate[0] ?? null;
  const needsAttention = [...habitStats].sort((a, b) => a.rate - b.rate || b.misses - a.misses)[0] ?? null;
  const average =
    habits.length > 0 && dates.length > 0
      ? Math.round(
          dates.reduce((sum, date) => sum + Math.round(((completedByDate[date] || 0) / habits.length) * 100), 0) /
            dates.length,
        )
      : 0;

  return {
    average,
    bestHabit,
    needsAttention,
    habitStats,
    completedByDate,
    streakDays: calculateStreakDays(dates, completedByDate),
  };
}


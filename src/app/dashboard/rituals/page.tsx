import DashboardCompanion from "@/components/DashboardCompanion";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDemoHabitLogs, getDemoHabits } from "@/lib/habit-data";
import { buildDateRange, summarizeHabitPerformance } from "@/lib/habit-insights";
import { format } from "date-fns";
import { getServerSession } from "next-auth";

export default async function RitualsPage() {
  const session: any = await getServerSession(authOptions);
  const isSubscribed = session?.user?.isSubscribed || false;
  const userId = session?.user?.id;
  const dateStr = format(new Date(), "yyyy-MM-dd");
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

  const total = habits.length;
  const completed = logs.filter((log) => log.completed).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const weeklySummary = summarizeHabitPerformance(habits, recentLogs, recentDates);

  return (
    <div className="mx-auto w-full max-w-4xl animate-aura-reveal">
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-400">Rituals</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          Daily rhythm and motivation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Motivation, score, aur streak signals yahan rakhe gaye hain so main dashboard sirf planning and execution par focused rahe.
        </p>
      </div>

      <DashboardCompanion
        completed={completed}
        total={total}
        progressPercent={progressPercent}
        streakDays={weeklySummary.streakDays}
      />
    </div>
  );
}

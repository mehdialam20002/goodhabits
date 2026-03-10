import type { Habit, HabitLog } from "@prisma/client";

const DEMO_HABIT_TITLES = [
  "Morning workout",
  "Drink 3 liters of water",
  "Sleep before 11:30 PM",
  "Read 10 pages",
  "Meditate for 10 minutes",
  "Code practice",
  "Learn new tech",
  "Work on personal project",
  "Apply to 5 jobs",
  "No social media after 9 PM",
];

export type HabitLogSnapshot = Pick<HabitLog, "habitId" | "date" | "completed">;
export type HabitSnapshot = Pick<Habit, "id" | "title">;

export function getDemoHabits(userId: string): Habit[] {
  const now = new Date();

  return DEMO_HABIT_TITLES.map((title, index) => ({
    id: `dummy-${index}`,
    userId,
    title,
    description: "Premium habit tracking experience",
    color: ["blue", "indigo", "violet", "emerald", "rose", "orange"][index % 6],
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  }));
}

export function getDemoHabitLogs(date: string): HabitLogSnapshot[] {
  const seed = date.split("-").reduce((sum, part) => sum + Number(part), 0);

  return Array.from({ length: DEMO_HABIT_TITLES.length }, (_, index) => ({
    habitId: `dummy-${index}`,
    date,
    completed: ((seed + index * 3) % 7) < 4,
  }));
}


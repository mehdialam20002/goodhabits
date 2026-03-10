"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDemoHabits, getDemoHabitLogs } from "@/lib/habit-data";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function getHabits() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  if (!session.user.isSubscribed) {
    return getDemoHabits(session.user.id);
  }

  return prisma.habit.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { createdAt: "asc" },
  });
}

export async function addHabit(title: string, color: string = "blue") {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!session.user.isSubscribed) {
    throw new Error("SUBSCRIPTION_REQUIRED");
  }

  const user = await prisma.user.upsert({
    where: { id: session.user.id },
    update: {},
    create: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || "User",
    },
  });

  await prisma.habit.create({
    data: {
      userId: user.id,
      title,
      color,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteHabit(id: string) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.habit.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
}

export async function editHabit(id: string, title: string) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.habit.updateMany({
    where: { id, userId: session.user.id },
    data: { title },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

export async function getHabitLogs(date: string) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  if (!session.user.isSubscribed) {
    return getDemoHabitLogs(date);
  }

  return prisma.habitLog.findMany({
    where: {
      habit: { userId: session.user.id },
      date,
    },
  });
}

export async function toggleHabitLog(habitId: string, date: string, completed: boolean) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!session.user.isSubscribed) {
    throw new Error("SUBSCRIPTION_REQUIRED");
  }

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: session.user.id },
    select: { id: true },
  });

  if (!habit) throw new Error("Not Found or Unauthorized");

  await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date,
      },
    },
    update: {
      completed,
    },
    create: {
      habitId,
      date,
      completed,
    },
  });

  revalidatePath("/dashboard");
}

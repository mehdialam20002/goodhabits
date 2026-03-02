"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getHabits() {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    // If not subscribed, return high-quality dummy habits
    if (!session.user.isSubscribed) {
        const dummyDate = new Date();
        const dummyUserId = session.user.id;
        const habitTitles = [
            "🌅 Morning Workout (30 mins)",
            "💧 Drink 3 Liters Water",
            "😴 Sleep Before 11:30 PM",
            "📚 Read 10 Pages",
            "🧘 Meditation (10 mins)",
            "💻 Code Practice (45 mins)",
            "🚀 Learn New Tech (20 mins)",
            "🛠️ Work on Personal Project (1 hr)",
            "💼 Apply to 5 Jobs / Send 5 DMs",
            "📱 No Social Media After 9 PM"
        ];

        return habitTitles.map((title, i) => ({
            id: `dummy-${i}`,
            userId: dummyUserId,
            title,
            description: "Premium habit tracking experience",
            color: ["blue", "indigo", "violet", "emerald", "rose", "orange"][i % 6],
            isArchived: false,
            createdAt: dummyDate,
            updatedAt: dummyDate
        }));
    }

    return await prisma.habit.findMany({
        where: { userId: session.user.id, isArchived: false },
        orderBy: { createdAt: "asc" },
    });
}

export async function addHabit(title: string, color: string = "blue") {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Restrict adding habits for unsubscribed users
    if (!session.user.isSubscribed) {
        throw new Error("SUBSCRIPTION_REQUIRED");
    }

    // Safety Sync: Ensure the user exists in the DB to prevent Foreign Key errors
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

    await prisma.habit.delete({
        where: { id, userId: session.user.id }
    });

    revalidatePath("/dashboard");
}

export async function getHabitLogs(date: string) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    // Dummy logs for unsubscribed users
    if (!session.user.isSubscribed) {
        // Return a mix of completed and uncompleted for a realistic look
        return Array.from({ length: 10 }).map((_, i) => ({
            habitId: `dummy-${i}`,
            date,
            completed: Math.random() > 0.5 // Random completion for better feel
        }));
    }

    return await prisma.habitLog.findMany({
        where: {
            habit: { userId: session.user.id },
            date
        }
    });
}

export async function toggleHabitLog(habitId: string, date: string, completed: boolean) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (!session.user.isSubscribed) {
        throw new Error("SUBSCRIPTION_REQUIRED");
    }

    // Verify ownership implicitly by trying to find the habit for this user first
    const habit = await prisma.habit.findUnique({
        where: { id: habitId, userId: session.user.id }
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

    // Revalidate so data gets refreshed instantly
    revalidatePath("/dashboard");
}

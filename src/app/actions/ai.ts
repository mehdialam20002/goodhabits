"use server";

import { getAIInsight } from "@/lib/ai";
import { getHabits, getHabitLogs } from "./habit";
import { format } from "date-fns";

export async function getHabitAIAnalysis() {
    try {
        const habits = await getHabits();
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const logs = await getHabitLogs(todayStr);

        const total = habits.length;
        const completed = logs.filter(l => l.completed).length;

        if (total === 0) {
            return "Start by adding some habits to track your progress!";
        }

        const habitTitles = habits.map(h => h.title).join(", ");
        const completionRate = Math.round((completed / total) * 100);

        const prompt = `User has ${total} habits: ${habitTitles}. Today, they completed ${completed} out of ${total} (${completionRate}%). Provide a motivational insight.`;

        return await getAIInsight(prompt);
    } catch (error) {
        console.error("Failed to get habit analysis:", error);
        return "Keep going! Your consistency today is the foundation for tomorrow's success.";
    }
}

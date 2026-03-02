import { subDays, addDays, format, startOfWeek, endOfWeek } from "date-fns";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHabits } from "@/app/actions/habit";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { week: weekParam } = await searchParams;
    const weekOffset = typeof weekParam === 'string' ? parseInt(weekParam) : 0;

    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const habits = await getHabits();
    const totalHabits = habits.length;

    // Calculate start and end of the selected week
    const today = new Date();
    const targetDate = addDays(today, weekOffset * 7);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Start Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

    const isSubscribed = session?.user?.isSubscribed || false;

    // Generate week data
    const chartData = [];
    let totalCompletions = 0;

    if (!isSubscribed) {
        // Impressive dummy data for unsubscribed users
        const dummyRates = [80, 90, 85, 100, 95, 80, 70]; // High consistent performance
        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(weekStart, i);
            const dayLabel = format(currentDate, "EEE");
            const rate = dummyRates[i];
            const count = Math.round((rate / 100) * 10); // 10 is the number of dummy habits

            chartData.push({
                name: dayLabel,
                completion: rate,
                count: count
            });
            totalCompletions += count;
        }
    } else {
        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(weekStart, i);
            const dateStr = format(currentDate, "yyyy-MM-dd");
            const dayLabel = format(currentDate, "EEE");

            const logs = await prisma.habitLog.findMany({
                where: {
                    habit: { userId: session.user.id },
                    date: dateStr,
                    completed: true
                }
            });

            const completed = logs.length;
            totalCompletions += completed;

            const rate = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;

            chartData.push({
                name: dayLabel,
                completion: rate,
                count: completed
            });
        }
    }

    const weeklyAverage = !isSubscribed ? 86 : (totalHabits > 0 ? Math.round((totalCompletions / (totalHabits * 7)) * 100) : 0);
    const streakDays = !isSubscribed ? 14 : 0; // Show a dummy streak of 14 for free users
    const weekLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;

    return (
        <div className="max-w-5xl mx-auto w-full animate-aura-reveal opacity-0" style={{ animationFillMode: 'forwards' }}>
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 stagger-1">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-aura">Aura Analytics</h1>
                    <p className="text-zinc-500 font-medium">Deep dive into your mindful consistency.</p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <Link
                        href={`/dashboard/analytics?week=${weekOffset - 1}`}
                        className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-sm font-bold px-4 text-zinc-600 dark:text-zinc-400">
                        {weekOffset === 0 ? "This Week" : weekLabel}
                    </span>
                    <Link
                        href={`/dashboard/analytics?week=${weekOffset + 1}`}
                        className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow stagger-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Weekly Average</h3>
                    <p className="text-5xl font-black text-zinc-900 dark:text-zinc-50 italic">{weeklyAverage}%</p>
                    <p className="text-xs text-emerald-600 mt-4 font-black uppercase tracking-widest">↑ 12% growth</p>
                </div>
                <div className="p-6 rounded-3xl glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow">
                    <h3 className="text-sm font-semibold text-zinc-500 mb-1">Total Habits Tracked</h3>
                    <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{totalHabits}</p>
                    <p className="text-xs text-zinc-500 mt-2">Active routines</p>
                </div>
                <div className="p-6 rounded-3xl glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900">
                    <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-600 mb-1">Current Streak</h3>
                    <p className="text-4xl font-bold">{streakDays} Days</p>
                    <p className="text-xs mt-2 opacity-80">You're on fire! 🔥</p>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow stagger-3">
                <h3 className="text-xl font-black tracking-tight mb-8">7-Day Consistency Curve</h3>
                <AnalyticsCharts data={chartData} />
            </div>
        </div>
    );
}

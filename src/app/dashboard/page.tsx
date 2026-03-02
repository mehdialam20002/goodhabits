import { getHabits, getHabitLogs } from "@/app/actions/habit";
import { getHabitAIAnalysis } from "@/app/actions/ai";
import HabitList from "@/components/HabitList";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { date: givenDateParams } = await searchParams;
    const session: any = await getServerSession(authOptions);
    const habits = await getHabits();
    const isSubscribed = session?.user?.isSubscribed || false;

    // Parse date param or use today
    const dateStr = typeof givenDateParams === 'string' ? givenDateParams : format(new Date(), "yyyy-MM-dd");

    const [logs, aiAnalysis] = await Promise.all([
        getHabitLogs(dateStr),
        getHabitAIAnalysis()
    ]);

    // Map the logs into a quick dictionary: { habitId: true/false }
    const habitCompletionStatus = logs.reduce((acc: any, log: any) => {
        acc[log.habitId] = log.completed;
        return acc;
    }, {} as Record<string, boolean>);

    // Calculate generic progress
    const total = habits.length;
    const completed = logs.filter((l: any) => l.completed).length;
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="max-w-5xl mx-auto w-full animate-aura-reveal opacity-0" style={{ animationFillMode: 'forwards' }}>
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 stagger-1">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-aura mb-2">Hello, Aura</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Your mindful journey continues today.</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-zinc-500 font-medium">Daily Progress</span>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-black italic">{progressPercent}%</span>
                        <div className="w-40 h-3 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden shadow-inner border border-zinc-200/50 dark:border-zinc-800/50">
                            <div
                                className="h-full bg-linear-to-r from-indigo-600 via-violet-500 to-emerald-400 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 stagger-2">
                    {/* The main interactive habit list component */}
                    <HabitList
                        habits={habits}
                        completionStatus={habitCompletionStatus}
                        currentDate={dateStr}
                        isSubscribed={isSubscribed}
                    />
                </div>

                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] glass-effect border-2 border-indigo-50 dark:border-indigo-900/20 soft-shadow premium-gradient aura-gradient stagger-3">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-3">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-aura-pulse" />
                            Aura Coaching
                        </h3>
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2">
                            "{aiAnalysis}"
                        </p>
                        <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Gemini 2.0 Oracle</p>
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 border-2 border-white dark:border-zinc-900" />
                                <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 border-2 border-white dark:border-zinc-900" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

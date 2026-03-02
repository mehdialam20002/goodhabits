import { getHabits, getHabitLogs } from "@/app/actions/habit";
import { getHabitAIAnalysis } from "@/app/actions/ai";
import HabitList from "@/components/HabitList";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sparkles } from "lucide-react";

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
        <div className="max-w-6xl mx-auto w-full animate-aura-reveal relative min-h-screen pb-20">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">Protocol Active</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 italic">Aura Orbit</h1>
                    <p className="text-sm font-medium text-zinc-400 max-w-md">Your structural intelligence, synchronized in real-time.</p>
                </div>

                <div className="flex flex-col md:items-end gap-3 p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-indigo-50 dark:border-zinc-800/50 shadow-xl shadow-indigo-100/20 dark:shadow-none">
                    <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">Efficiency Index</span>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-indigo-600 dark:text-cyan-400">{progressPercent}%</span>
                        <div className="w-40 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
                            <div
                                className="h-full aura-glow transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <h2 className="text-lg font-black tracking-tight text-zinc-800 dark:text-zinc-200">Daily Directive</h2>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{format(new Date(dateStr), "EEEE, d MMMM")}</span>
                    </div>
                    {/* The main interactive habit list component */}
                    <HabitList
                        habits={habits}
                        completionStatus={habitCompletionStatus}
                        currentDate={dateStr}
                        isSubscribed={isSubscribed}
                    />
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[3rem] glass-card border-indigo-50/50 dark:border-zinc-800/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 aura-glow opacity-10 rounded-full blur-2xl transition-all group-hover:opacity-20" />

                        <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-indigo-600 dark:text-cyan-400 mb-6 flex items-center gap-3">
                            <Sparkles className="w-4 h-4 animate-aura-pulse" />
                            AI Synthesis
                        </h3>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed italic border-l-4 border-indigo-600 dark:border-cyan-400 pl-6 py-2">
                            "{aiAnalysis}"
                        </p>
                        <div className="mt-8 pt-6 border-t border-indigo-50/50 dark:border-zinc-800/50">
                            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-400">Processing via Gemini-Aura Engine</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[3rem] bg-linear-to-br from-zinc-900 to-zinc-950 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-48 h-48 aura-glow opacity-30 rounded-full blur-3xl pointer-events-none" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Weekly Goal</h4>
                        <p className="text-xl font-bold leading-tight mb-6">Maintain 85% average across all habits.</p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

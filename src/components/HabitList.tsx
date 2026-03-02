"use client";

import { useState, useTransition, useEffect } from "react";
import { Habit } from "@prisma/client";
import { Check, Plus, Trash2, Edit2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, Sparkles, CalendarDays } from "lucide-react";
import Link from "next/link";
import { format, subDays, addDays } from "date-fns";
import { addHabit, toggleHabitLog, deleteHabit } from "@/app/actions/habit";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface HabitListProps {
    habits: Habit[];
    completionStatus: Record<string, boolean>;
    currentDate: string;
    isSubscribed?: boolean;
}

export default function HabitList({ habits, completionStatus, currentDate, isSubscribed = false }: HabitListProps) {
    const [optimisticStatus, setOptimisticStatus] = useState<Record<string, boolean>>(completionStatus);
    const [newTitle, setNewTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Re-sync optimistic status when completionStatus from server changes
    useEffect(() => {
        setOptimisticStatus(completionStatus);
    }, [completionStatus]);

    const completedCount = Object.values(optimisticStatus).filter(Boolean).length;
    const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
    const [currentDateState, setCurrentDateState] = useState(new Date(currentDate + "T12:00:00")); // Use midday to avoid TZ shifts

    const handleToggle = async (habitId: string) => {
        const isCompleted = optimisticStatus[habitId] || false;
        const nextState = !isCompleted;

        // Optimistic Update
        setOptimisticStatus((prev) => ({ ...prev, [habitId]: nextState }));

        try {
            await toggleHabitLog(habitId, format(currentDateState, "yyyy-MM-dd"), nextState);
        } catch {
            toast.error("Failed to update habit.");
            // Rollback
            setOptimisticStatus((prev) => ({ ...prev, [habitId]: isCompleted }));
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            if (habits.length >= 10) {
                toast.error("You can track a maximum of 10 habits at a time.");
                return;
            }
            await addHabit(newTitle.trim());
            setNewTitle("");
            setIsAdding(false);
            toast.success("Habit created!");
        } catch {
            toast.error("Failed to quickly create habit.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteHabit(id);
            toast.success("Habit deleted!");
        } catch {
            toast.error("Failed to delete habit.");
        }
    };

    const navigateDate = (daysCount: number) => {
        const newDate = addDays(currentDateState, daysCount);
        handleDateChange(newDate);
    };

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;
        setCurrentDateState(date);
        window.location.href = `/dashboard?date=${format(date, "yyyy-MM-dd")}`;
    };

    return (
        <div className="w-full">
            {/* Date Navigation */}
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 soft-shadow rounded-2xl p-2 px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDate(-1)}
                        className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9 shrink-0 transition-colors"
                        title="Previous Day"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex flex-col items-center gap-0 h-auto py-1 px-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 group transition-all"
                            >
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">Calendar</span>
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    {format(currentDateState, "MMM d, yyyy")}
                                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl glass-effect overflow-hidden" align="center">
                            <Calendar
                                mode="single"
                                selected={currentDateState}
                                onSelect={handleDateChange}
                                initialFocus
                                className="p-4"
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDate(1)}
                        className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9 shrink-0 transition-colors"
                        title="Next Day"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Daily Focus</h2>
                    <p className="text-xs font-medium text-zinc-500">Track your progress and stay consistent.</p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 px-4 rounded-xl">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Progress</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{progress}%</span>
                            <div className="w-20 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {!isSubscribed && (
                <div className="mb-8 p-5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 relative overflow-hidden group border border-zinc-800 dark:border-zinc-200">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/20">
                                <Sparkles className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight">Free Explorer</h3>
                                <p className="text-[10px] font-medium opacity-60">Upgrade to Pro for unlimited habits.</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/subscription"
                            className="px-4 py-2 rounded-lg bg-accent text-white font-bold text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-sm"
                        >
                            Upgrade
                        </Link>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {habits.length === 0 && (
                    <div className="text-center p-12 border rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        <CalendarDays className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">No habits yet</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed lowercase">
                            start building your routine by adding your first habit.
                        </p>
                    </div>
                )}

                {habits.map((habit) => {
                    const isDone = optimisticStatus[habit.id] || false;

                    return (
                        <div
                            key={habit.id}
                            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${isDone
                                ? "bg-white dark:bg-zinc-900/40 border-indigo-100 dark:border-zinc-800/50 shadow-sm"
                                : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 hover:border-indigo-200 dark:hover:border-cyan-900/50 hover:shadow-xl hover:shadow-indigo-500/5"
                                }`}
                            onClick={() => {
                                if (!isSubscribed) return window.location.href = "/dashboard/subscription";
                                handleToggle(habit.id);
                            }}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-500 ${isDone
                                        ? "bg-indigo-600 dark:bg-cyan-500 border-indigo-600 dark:border-cyan-500 text-white shadow-lg shadow-indigo-500/30"
                                        : "border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-400 dark:group-hover:border-cyan-400"
                                        }`}
                                >
                                    {isDone && <Check className="w-4 h-4 stroke-[4] animate-in zoom-in duration-300" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <div className={`text-base font-bold tracking-tight transition-all duration-500 ${isDone ? "text-zinc-400 line-through opacity-60" : "text-zinc-900 dark:text-zinc-100"}`}>
                                            {habit.title}
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-opacity duration-500 ${isDone ? "text-indigo-500 dark:text-cyan-400" : "text-zinc-400 opacity-60"}`}>
                                        {isDone ? "synchronized" : "pending protocol"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                            <Edit2 className="h-4 w-4 text-zinc-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-zinc-200 dark:border-zinc-800 p-2 shadow-2xl glass-card">
                                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" onClick={() => handleDelete(habit.id)}>
                                            <Trash2 className="mr-3 h-4 w-4" />
                                            Terminate Habit
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                })}

                {isAdding ? (
                    <form
                        onSubmit={handleAdd}
                        className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-950 border border-indigo-100 dark:border-zinc-800 rounded-3xl shadow-2xl animate-aura-reveal"
                    >
                        <Input
                            autoFocus
                            className="bg-zinc-50 dark:bg-zinc-900 border-none ring-0 focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-cyan-500/20 shadow-none px-4 h-12 rounded-2xl text-base font-bold italic"
                            placeholder="Identify New Objective..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 rounded-2xl font-black text-sm uppercase tracking-widest bg-indigo-600 dark:bg-cyan-500 text-white border-none h-12 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Establish Habit
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-2xl font-bold text-zinc-400 h-12 hover:bg-zinc-100 dark:hover:bg-zinc-900 px-6">
                                Abort
                            </Button>
                        </div>
                    </form>
                ) : (
                    (isSubscribed && habits.length < 10) || !isSubscribed ? (
                        <button
                            onClick={() => {
                                if (!isSubscribed) return window.location.href = "/dashboard/subscription";
                                setIsAdding(true);
                            }}
                            className="w-full h-16 rounded-2xl border-2 border-dashed border-indigo-100 dark:border-zinc-800/50 flex items-center justify-center gap-3 text-zinc-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-300 dark:hover:border-cyan-900/50 hover:bg-indigo-50/10 dark:hover:bg-cyan-900/5 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-50/0 via-indigo-50/30 to-indigo-50/0 -translate-x-full group-hover:animate-shimmer" />
                            <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">{isSubscribed ? "Initialize New Protocol" : "Unlock Pro Capabilities"}</span>
                        </button>
                    ) : null
                )}
            </div>
        </div>
    );
}

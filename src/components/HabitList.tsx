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
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 soft-shadow rounded-3xl p-3 px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDate(-1)}
                        className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 w-10 shrink-0"
                        title="Previous Day"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex flex-col items-center gap-0.5 h-auto py-2 px-6 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 group transition-all"
                            >
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">Select Date</span>
                                <span className="text-xl font-black text-gradient flex items-center gap-2">
                                    {format(currentDateState, "MMMM d, yyyy")}
                                    <CalendarDays className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all" />
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl glass-effect overflow-hidden" align="center">
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
                        className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 w-10 shrink-0"
                        title="Next Day"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-[10px] text-center font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 opacity-60">
                    <Info className="w-3 h-3" />
                    Click date to open calendar
                </p>
            </div>

            <div className="flex items-center justify-between mb-10 stagger-1">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(0,245,255,0.4)]" />
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter">Today's Clarity</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Aura Status: {progress}% Sync</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-primary/5 border border-primary/20 hidden md:flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Completion</span>
                        <span className="text-xl font-black italic text-primary">{progress}%</span>
                    </div>
                    <div className="w-32 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>


            {!isSubscribed && (
                <div className="mb-10 p-6 rounded-[2rem] bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-2xl relative overflow-hidden group border border-primary/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-black tracking-tight mb-0.5">Free Explorer Tier</h3>
                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-relaxed">Upgrade for ₹180 to track unlimited 🚀</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/subscription"
                            className="px-6 py-3 rounded-xl bg-primary text-zinc-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Get Lifetime Access
                        </Link>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {habits.length === 0 && (
                    <div className="text-center p-16 border-2 border-dashed rounded-[3rem] border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 animate-fade-in-up">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-4">
                            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No habits for today</h3>
                        <p className="text-zinc-500 max-w-[240px] mx-auto text-sm leading-relaxed">
                            Start building your routine by adding your first habit below.
                        </p>
                    </div>
                )}

                {habits.map((habit) => {
                    const isDone = optimisticStatus[habit.id] || false;

                    return (
                        <div
                            key={habit.id}
                            className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${isDone
                                ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/5 dark:text-primary-foreground/90 dark:border-primary/30 shadow-inner"
                                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 soft-shadow hover:border-primary/50 dark:hover:border-primary/40 hover:scale-[1.01]"
                                }`}
                            onClick={() => {
                                if (!isSubscribed) return window.location.href = "/dashboard/subscription";
                                handleToggle(habit.id);
                            }}
                        >
                            <div className="flex items-center gap-3.5 flex-1">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${isDone
                                        ? "bg-primary text-primary-foreground border-transparent rotate-0 shadow-lg shadow-primary/30"
                                        : "border-zinc-100 dark:border-zinc-800 group-hover:border-primary/30 rotate-45"
                                        }`}
                                >
                                    {isDone && <Check className="w-5 h-5 stroke-[3]" />}
                                    {!isDone && <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-primary/50" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <div className={`font-black tracking-tight transition-all duration-500 ${isDone ? "opacity-90 line-through" : "text-zinc-900 dark:text-zinc-50"}`}>
                                            {habit.title}
                                        </div>
                                        {!isSubscribed && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-[6px] font-black uppercase tracking-[0.2em] text-zinc-500">Sample</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-500 ${isDone ? "opacity-60" : "opacity-40 text-primary"}`}>
                                            {isDone ? "Goal Achieved" : "Tap to Complete"}
                                        </span>
                                        {isDone && <Sparkles className="w-2 h-2 text-primary" />}
                                    </div>
                                </div>
                            </div>

                            {/* Action Menu Container */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className={`h-10 w-10 p-0 rounded-2xl ${isDone ? "text-zinc-400 hover:text-white dark:hover:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                                            <span className="sr-only">Open menu</span>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px] rounded-3xl glass-effect border-zinc-200 dark:border-zinc-800 p-2">
                                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950 font-bold" onClick={() => handleDelete(habit.id)}>
                                            <Trash2 className="mr-3 h-4 w-4" />
                                            Delete Habit
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
                        className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-100 rounded-[2.5rem] shadow-2xl animate-fade-in-up"
                    >
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Habit Name</label>
                            <Input
                                autoFocus
                                className="bg-zinc-50 dark:bg-zinc-900 border-none ring-0 focus-visible:ring-0 shadow-none px-4 h-14 rounded-2xl text-lg font-bold"
                                placeholder="E.g. Morning Meditation"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 h-12 rounded-2xl font-bold text-sm bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                                Create Habit
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="h-12 px-6 rounded-2xl font-bold text-sm text-zinc-500">
                                Cancel
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
                            className="w-full h-24 rounded-[3rem] border-2 border-dashed border-primary/20 dark:border-primary/10 flex items-center justify-center gap-4 text-primary/60 hover:text-primary hover:border-primary bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-primary/5 transition-all duration-700 group overflow-hidden relative shadow-2xl shadow-transparent hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-700 border border-primary/10 group-hover:border-primary/30 shadow-primary/5">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter uppercase group-hover:tracking-widest transition-all duration-700 z-10">{isSubscribed ? "Ignite New Habit" : "Unlock Full Tracking"}</span>
                            <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:animate-aura-pulse transition-opacity delay-300 z-10" />
                        </button>
                    ) : null
                )}
            </div>
        </div>
    );
}

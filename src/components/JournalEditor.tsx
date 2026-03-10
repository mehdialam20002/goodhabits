"use client";

import { useEffect, useState, useTransition } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveNote } from "@/app/actions/note";
import { useRouter } from "next/navigation";

interface JournalEditorProps {
    initialNote: string;
    currentDate: string;
    prompts?: string[];
}

export default function JournalEditor({ initialNote, currentDate, prompts = [] }: JournalEditorProps) {
    const [content, setContent] = useState(initialNote);
    const [isSaving, setIsSaving] = useState(false);
    const [currentDateState, setCurrentDateState] = useState(new Date(`${currentDate}T12:00:00`));
    const [isNavigating, startNavigation] = useTransition();
    const router = useRouter();

    useEffect(() => {
        setContent(initialNote);
    }, [initialNote]);

    useEffect(() => {
        setCurrentDateState(new Date(`${currentDate}T12:00:00`));
    }, [currentDate]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveNote(format(currentDateState, "yyyy-MM-dd"), content);
            toast.success("Note saved successfully.");
        } catch {
            toast.error("Failed to save note.");
        } finally {
            setIsSaving(false);
        }
    };

    const navigateDate = (daysCount: number) => {
        const newDate = addDays(currentDateState, daysCount);
        setCurrentDateState(newDate);
        startNavigation(() => {
            router.push(`/dashboard/notes?date=${format(newDate, "yyyy-MM-dd")}`);
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 soft-shadow rounded-2xl p-2 px-4">
                <Button variant="ghost" size="sm" onClick={() => navigateDate(-1)} className="rounded-xl" disabled={isNavigating}>- 1 Day</Button>
                <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="w-4 h-4 text-zinc-500" />
                    <span>{format(currentDateState, "MMMM d, yyyy")}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigateDate(1)} className="rounded-xl" disabled={isNavigating}>+ 1 Day</Button>
            </div>

            {prompts.length > 0 && (
                <div className="mb-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">Reflection Prompts</p>
                            <p className="text-xs text-zinc-500">Use one if you are stuck on what to write.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {prompts.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => setContent((prev) => (prev ? `${prev}\n\n${prompt}` : prompt))}
                                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-cyan-500/40 transition"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl soft-shadow overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <span className="text-sm font-medium text-zinc-500">How was your day?</span>
                    <Button
                        size="sm"
                        className="rounded-xl gap-2 shadow-none"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Note"}
                    </Button>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="I completed all my habits today..."
                    className="flex-1 w-full resize-none p-6 bg-transparent border-0 focus:ring-0 outline-none text-base leading-relaxed"
                />
            </div>
        </div>
    );
}

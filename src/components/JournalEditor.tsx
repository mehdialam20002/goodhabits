"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveNote } from "@/app/actions/note";

interface JournalEditorProps {
    initialNote: string;
    currentDate: string;
}

export default function JournalEditor({ initialNote, currentDate }: JournalEditorProps) {
    const [content, setContent] = useState(initialNote);
    const [isSaving, setIsSaving] = useState(false);
    const [currentDateState, setCurrentDateState] = useState(new Date(currentDate));

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
        window.location.href = `/dashboard/notes?date=${format(newDate, "yyyy-MM-dd")}`;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 soft-shadow rounded-2xl p-2 px-4">
                <Button variant="ghost" size="sm" onClick={() => navigateDate(-1)} className="rounded-xl">- 1 Day</Button>
                <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="w-4 h-4 text-zinc-500" />
                    <span>{format(currentDateState, "MMMM d, yyyy")}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigateDate(1)} className="rounded-xl">+ 1 Day</Button>
            </div>

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

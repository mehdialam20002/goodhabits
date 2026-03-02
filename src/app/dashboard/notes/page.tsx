import { getNoteByDate } from "@/app/actions/note";
import JournalEditor from "@/components/JournalEditor";
import { format } from "date-fns";

export default async function NotesPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { date: givenDateParams } = await searchParams;
    const dateStr = typeof givenDateParams === 'string' ? givenDateParams : format(new Date(), "yyyy-MM-dd");

    const note = await getNoteByDate(dateStr);

    return (
        <div className="max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Journal</h1>
                <p className="text-zinc-500">Document your thoughts, wins, and reflections.</p>
            </header>

            <JournalEditor initialNote={note?.content || ""} currentDate={dateStr} />
        </div>
    );
}

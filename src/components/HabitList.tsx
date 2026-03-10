"use client";

import { addHabit, deleteHabit, editHabit, toggleHabitLog } from "@/app/actions/habit";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Habit } from "@prisma/client";
import { addDays, format } from "date-fns";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Edit2, Eye, Flame, GripVertical, Layers3, Pin, Plus, Search, Settings2, Sparkles, Tag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface HabitListProps { habits: Habit[]; completionStatus: Record<string, boolean>; currentDate: string; isSubscribed?: boolean; }
type HabitMetadata = { category: string; difficulty: string; cadence: string; color: string };

const TEMPLATE_HABITS = ["Morning walk", "Read 10 pages", "Deep work block", "Drink 3L water", "Meditation", "No phone after 10 PM"];
const defaultMeta: HabitMetadata = { category: "General", difficulty: "Medium", cadence: "Daily", color: "Slate" };
const categoryStyles: Record<string, string> = {
  Health: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Study: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  Work: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Mind: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  General: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function HabitList({ habits, completionStatus, currentDate, isSubscribed = false }: HabitListProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<Record<string, boolean>>(completionStatus);
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const [currentDateState, setCurrentDateState] = useState(new Date(`${currentDate}T12:00:00`));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done" | "priority">("all");
  const [focusMode, setFocusMode] = useState(false);
  const [priorityIds, setPriorityIds] = useState<string[]>([]);
  const [habitOrder, setHabitOrder] = useState<string[]>([]);
  const [draggingHabitId, setDraggingHabitId] = useState<string | null>(null);
  const [habitMeta, setHabitMeta] = useState<Record<string, HabitMetadata>>({});
  const [draftMeta, setDraftMeta] = useState<HabitMetadata>(defaultMeta);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [metadataHabitId, setMetadataHabitId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => setOptimisticStatus(completionStatus), [completionStatus]);
  useEffect(() => setCurrentDateState(new Date(`${currentDate}T12:00:00`)), [currentDate]);

  useEffect(() => {
    const read = <T,>(key: string, fallback: T) => {
      try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
    };
    setPriorityIds(read("habit-priority-ids", []));
    setHabitOrder(read("habit-order", []));
    setHabitMeta(read("habit-meta-map", {}));
    setDraftMeta(read("habit-draft-meta", defaultMeta));
    const prefs = read<{ focusFirst?: boolean }>("aura-preferences", {});
    setFocusMode(Boolean(prefs.focusFirst));
    const soundPreference = window.localStorage.getItem("aura-sound-enabled");
    if (soundPreference) setSoundEnabled(soundPreference === "true");
    setShowOnboarding(!window.localStorage.getItem("aura-onboarding-dismissed"));
  }, []);

  useEffect(() => { window.localStorage.setItem("habit-priority-ids", JSON.stringify(priorityIds)); }, [priorityIds]);
  useEffect(() => { window.localStorage.setItem("habit-order", JSON.stringify(habitOrder)); }, [habitOrder]);
  useEffect(() => { window.localStorage.setItem("habit-meta-map", JSON.stringify(habitMeta)); }, [habitMeta]);
  useEffect(() => { window.localStorage.setItem("habit-draft-meta", JSON.stringify(draftMeta)); }, [draftMeta]);
  useEffect(() => {
    setHabitOrder((prev) => {
      const existing = prev.filter((id) => habits.some((habit) => habit.id === id));
      const missing = habits.map((habit) => habit.id).filter((id) => !existing.includes(id));
      return [...existing, ...missing];
    });
    setHabitMeta((prev) => {
      const next = { ...prev };
      let changed = false;
      habits.forEach((habit) => {
        if (!next[habit.id]) {
          next[habit.id] = draftMeta;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [draftMeta, habits]);

  const completedCount = Object.values(optimisticStatus).filter(Boolean).length;
  const progress = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;
  const orderedHabits = useMemo(() => {
    const rank = new Map(habitOrder.map((id, index) => [id, index]));
    return [...habits].sort((a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999));
  }, [habitOrder, habits]);

  const visibleHabits = orderedHabits.filter((habit) => {
    const done = optimisticStatus[habit.id] || false;
    const priority = priorityIds.includes(habit.id);
    return habit.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || (filter === "pending" && !done) || (filter === "done" && done) || (filter === "priority" && priority)) &&
      (!focusMode || priority);
  });

  const beginQuickAdd = (title = "") => {
    if (!isSubscribed) return router.push("/dashboard/subscription");
    setNewTitle(title); setIsAdding(true); setShowOnboarding(false);
  };
  const dismissOnboarding = () => { setShowOnboarding(false); window.localStorage.setItem("aura-onboarding-dismissed", "true"); };
  const togglePriority = (habitId: string) => setPriorityIds((prev) => prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId].slice(-3));
  const updateHabitMeta = (habitId: string, nextMeta: Partial<HabitMetadata>) => setHabitMeta((prev) => ({ ...prev, [habitId]: { ...(prev[habitId] ?? defaultMeta), ...nextMeta } }));
  const updateDraftMeta = (nextMeta: Partial<HabitMetadata>) => setDraftMeta((prev) => ({ ...prev, ...nextMeta }));
  const pulseFeedback = () => {
    if ("vibrate" in navigator) navigator.vibrate(18);
    if (!soundEnabled) return;
    try {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 600;
      gain.gain.value = 0.02;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.06);
    } catch {}
  };

  const handleToggle = async (habitId: string) => {
    const before = optimisticStatus[habitId] || false;
    setOptimisticStatus((prev) => ({ ...prev, [habitId]: !before }));
    pulseFeedback();
    try { await toggleHabitLog(habitId, format(currentDateState, "yyyy-MM-dd"), !before); }
    catch { toast.error("Failed to update habit."); setOptimisticStatus((prev) => ({ ...prev, [habitId]: before })); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      if (habits.length >= 10) return toast.error("You can track a maximum of 10 habits at a time.");
      await addHabit(newTitle.trim()); setNewTitle(""); setIsAdding(false); toast.success("Habit created!");
    } catch { toast.error("Failed to quickly create habit."); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHabit(id);
      setHabitMeta((prev) => { const next = { ...prev }; delete next[id]; return next; });
      setPriorityIds((prev) => prev.filter((entry) => entry !== id));
      toast.success("Habit deleted!");
    } catch { toast.error("Failed to delete habit."); }
  };

  const handleEdit = async (habitId: string) => {
    if (!editingTitle.trim()) return;
    try { await editHabit(habitId, editingTitle.trim()); setEditingHabitId(null); setEditingTitle(""); toast.success("Habit updated."); }
    catch { toast.error("Failed to rename habit."); }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    const nextDate = format(date, "yyyy-MM-dd");
    setCurrentDateState(date);
    startNavigation(() => router.push(`/dashboard?date=${nextDate}`));
  };
  const moveHabit = (targetId: string) => {
    if (!draggingHabitId || draggingHabitId === targetId) return;
    setHabitOrder((prev) => {
      const base = prev.length ? [...prev] : habits.map((habit) => habit.id);
      const from = base.indexOf(draggingHabitId), to = base.indexOf(targetId);
      if (from === -1 || to === -1) return base;
      const [moved] = base.splice(from, 1); base.splice(to, 0, moved); return base;
    });
  };

  return <div className="w-full">
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-2 px-4 soft-shadow dark:border-zinc-800 dark:bg-zinc-900">
        <Button variant="ghost" size="icon" onClick={() => handleDateChange(addDays(currentDateState, -1))} disabled={isNavigating} className="h-9 w-9 rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" disabled={isNavigating} className="h-auto rounded-xl px-4 py-1">
              <span className="flex items-center gap-2 text-lg font-bold">{format(currentDateState, "MMM d, yyyy")}<CalendarDays className="h-4 w-4 text-zinc-400" /></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden rounded-3xl border-zinc-200 p-0 dark:border-zinc-800"><Calendar mode="single" selected={currentDateState} onSelect={handleDateChange} initialFocus className="p-4" /></PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={() => handleDateChange(addDays(currentDateState, 1))} disabled={isNavigating} className="h-9 w-9 rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>

    <div className="mb-8 flex items-center justify-between">
      <div><h2 className="text-2xl font-bold tracking-tight">Daily Focus</h2><p className="text-xs font-medium text-zinc-500">Track your progress and stay consistent.</p></div>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-sm font-bold">{progress}%</span>
      </div>
    </div>

    {showOnboarding && <div className="mb-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300"><Sparkles className="h-3.5 w-3.5" />Quick Start</div>
          <h3 className="mt-4 text-2xl font-black tracking-tight">Set up a cleaner daily system in one minute</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">Start with a few strong habits, pin the top priorities, then drag them into the order you actually want to execute each day.</p>
        </div>
        <button type="button" onClick={dismissOnboarding} className="rounded-2xl border border-zinc-200 p-3 text-zinc-500 dark:border-zinc-800"><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] bg-zinc-50 p-5 dark:bg-zinc-900/60">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Starter templates</p>
          <div className="mt-4 flex flex-wrap gap-2">{TEMPLATE_HABITS.map((template) => <button key={template} type="button" onClick={() => beginQuickAdd(template)} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">{template}</button>)}</div>
        </div>
        <div className="rounded-[1.75rem] border border-zinc-200 p-5 dark:border-zinc-800">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Workflow</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-3"><Layers3 className="h-4 w-4 text-indigo-500 dark:text-cyan-400" />Drag cards to set your execution order.</div>
            <div className="flex items-center gap-3"><Pin className="h-4 w-4 text-indigo-500 dark:text-cyan-400" />Pin top 3 habits as your daily must-win list.</div>
            <div className="flex items-center gap-3"><Settings2 className="h-4 w-4 text-indigo-500 dark:text-cyan-400" />Open habit setup to add category, difficulty, and cadence.</div>
          </div>
        </div>
      </div>
    </div>}

    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_auto_auto]">
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"><Search className="h-4 w-4 text-zinc-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search habits..." className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400" /></div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">{["all", "pending", "done", "priority"].map((key) => <button key={key} type="button" onClick={() => setFilter(key as typeof filter)} className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${filter === key ? "bg-indigo-600 text-white dark:bg-cyan-500" : "text-zinc-400"}`}>{key}</button>)}</div>
      <button type="button" onClick={() => setFocusMode((prev) => !prev)} className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.2em] ${focusMode ? "border-indigo-500 bg-indigo-600 text-white dark:border-cyan-400 dark:bg-cyan-500" : "border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"}`}><Eye className="h-4 w-4" />Focus Mode</button>
    </div>

    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500 dark:bg-zinc-900">{completedCount} complete</div>
      <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500 dark:bg-zinc-900">{Math.max(habits.length - completedCount, 0)} pending</div>
      <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500 dark:bg-zinc-900">{priorityIds.length}/3 priorities pinned</div>
      <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500 dark:bg-zinc-900">Drag to reorder</div>
    </div>

    {!isSubscribed && <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-50 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/20"><Sparkles className="h-5 w-5 text-accent" /></div><div><h3 className="text-sm font-bold tracking-tight">Free Explorer</h3><p className="text-[10px] font-medium opacity-60">Upgrade to Pro for unlimited habits.</p></div></div>
        <Link href="/dashboard/subscription" className="rounded-lg bg-accent px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">Upgrade</Link>
      </div>
    </div>}

    <div className="space-y-4">
      {habits.length === 0 && <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/20"><CalendarDays className="mx-auto mb-3 h-8 w-8 text-zinc-300 dark:text-zinc-700" /><h3 className="mb-1 text-base font-bold">No habits yet</h3><p className="text-xs leading-relaxed text-zinc-500 lowercase">start building your routine by adding your first habit.</p></div>}

      {visibleHabits.map((habit) => {
        const done = optimisticStatus[habit.id] || false, priority = priorityIds.includes(habit.id), meta = habitMeta[habit.id] ?? defaultMeta;
        return <div key={habit.id} className={`group rounded-2xl border ${done ? "border-indigo-100 bg-white shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/40" : "border-zinc-100 bg-white hover:shadow-xl dark:border-zinc-900 dark:bg-zinc-950"}`} onDragOver={(e) => { e.preventDefault(); moveHabit(habit.id); }} onDrop={() => setDraggingHabitId(null)} onDragEnd={() => setDraggingHabitId(null)}>
          <div className="flex cursor-pointer items-center justify-between p-4 select-none" onClick={() => isSubscribed ? handleToggle(habit.id) : router.push("/dashboard/subscription")}>
            <div className="flex flex-1 items-center gap-4">
              <button type="button" draggable onDragStart={() => setDraggingHabitId(habit.id)} onClick={(e) => e.stopPropagation()} className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"><GripVertical className="h-4 w-4" /></button>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${done ? "border-indigo-600 bg-indigo-600 text-white dark:border-cyan-500 dark:bg-cyan-500" : "border-zinc-200 dark:border-zinc-800"}`}>{done && <Check className="h-4 w-4 stroke-[4]" />}</div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  {editingHabitId === habit.id ? <form onSubmit={(e) => { e.preventDefault(); handleEdit(habit.id); }}><input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold outline-none dark:border-zinc-800 dark:bg-zinc-950" autoFocus /></form> : <div className={`text-base font-bold tracking-tight ${done ? "text-zinc-400 line-through opacity-60" : "text-zinc-900 dark:text-zinc-100"}`}>{habit.title}</div>}
                  {priority && <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Priority</span>}
                  <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${categoryStyles[meta.category] ?? categoryStyles.General}`}>{meta.category}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${done ? "text-indigo-500 dark:text-cyan-400" : "text-zinc-400 opacity-60"}`}>{done ? "synchronized" : "pending protocol"}</div>
                  <div className="rounded-full bg-zinc-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-900">{meta.difficulty}</div>
                  <div className="rounded-full bg-zinc-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-900">{meta.cadence}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-9 w-9 rounded-xl p-0 opacity-0 group-hover:opacity-100"><Edit2 className="h-4 w-4 text-zinc-400" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-2xl">
                  <DropdownMenuItem className="cursor-pointer rounded-xl p-3 text-xs font-black uppercase tracking-widest" onClick={() => { setEditingHabitId(habit.id); setEditingTitle(habit.title); }}><Edit2 className="mr-3 h-4 w-4" />Rename Habit</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-xl p-3 text-xs font-black uppercase tracking-widest" onClick={() => setMetadataHabitId((prev) => prev === habit.id ? null : habit.id)}><Tag className="mr-3 h-4 w-4" />Edit Metadata</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-xl p-3 text-xs font-black uppercase tracking-widest" onClick={() => togglePriority(habit.id)}><Pin className="mr-3 h-4 w-4" />{priority ? "Unpin Priority" : "Pin as Priority"}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-xl p-3 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400" onClick={() => handleDelete(habit.id)}><Trash2 className="mr-3 h-4 w-4" />Terminate Habit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {metadataHabitId === habit.id && <div className="border-t border-zinc-100 px-4 pb-4 pt-4 dark:border-zinc-900">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Category", value: meta.category, options: ["General", "Health", "Study", "Work", "Mind"], keyName: "category" },
                { label: "Difficulty", value: meta.difficulty, options: ["Easy", "Medium", "Hard"], keyName: "difficulty" },
                { label: "Cadence", value: meta.cadence, options: ["Daily", "Weekdays", "Alternate", "Custom"], keyName: "cadence" },
                { label: "Color", value: meta.color, options: ["Slate", "Emerald", "Indigo", "Amber", "Fuchsia"], keyName: "color" },
              ].map((field) => <div key={field.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{field.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">{field.options.map((option) => <button key={option} type="button" onClick={() => updateHabitMeta(habit.id, { [field.keyName]: option } as Partial<HabitMetadata>)} className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${field.value === option ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"}`}>{option}</button>)}</div>
              </div>)}
            </div>
          </div>}
        </div>;
      })}

      {isAdding ? <form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <Input autoFocus className="h-12 rounded-2xl border-none bg-zinc-50 px-4 text-base font-bold italic shadow-none dark:bg-zinc-900" placeholder="Identify New Objective..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <div className="flex flex-wrap gap-2">{TEMPLATE_HABITS.map((template) => <button key={template} type="button" onClick={() => setNewTitle(template)} className="rounded-full border border-zinc-200 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:border-zinc-800">{template}</button>)}</div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Category", value: draftMeta.category, options: ["General", "Health", "Study", "Work", "Mind"], keyName: "category" },
            { label: "Difficulty", value: draftMeta.difficulty, options: ["Easy", "Medium", "Hard"], keyName: "difficulty" },
            { label: "Cadence", value: draftMeta.cadence, options: ["Daily", "Weekdays", "Alternate", "Custom"], keyName: "cadence" },
          ].map((field) => <div key={field.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{field.label}</p>
            <div className="mt-3 flex flex-wrap gap-2">{field.options.map((option) => <button key={option} type="button" onClick={() => updateDraftMeta({ [field.keyName]: option } as Partial<HabitMetadata>)} className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${field.value === option ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"}`}>{option}</button>)}</div>
          </div>)}
        </div>
        <p className="text-xs text-zinc-500">These selectors become the default setup for the next habit you create.</p>
        <div className="flex gap-3">
          <Button type="submit" className="h-12 flex-1 rounded-2xl border-none bg-indigo-600 text-sm font-black uppercase tracking-widest text-white dark:bg-cyan-500">Establish Habit</Button>
          <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="h-12 rounded-2xl px-6 text-zinc-400">Abort</Button>
        </div>
      </form> : ((isSubscribed && habits.length < 10) || !isSubscribed) ? <button onClick={() => beginQuickAdd()} className="relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-indigo-100 text-zinc-400 dark:border-zinc-800/50"><Plus className="h-5 w-5" /><span className="text-[11px] font-black uppercase tracking-[0.3em]">{isSubscribed ? "Initialize New Protocol" : "Unlock Pro Capabilities"}</span></button> : null}

      {visibleHabits.length === 0 && habits.length > 0 && <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800"><Flame className="mx-auto mb-3 h-6 w-6 text-zinc-300 dark:text-zinc-700" /><p className="text-sm font-bold">No habits match this view.</p><p className="mt-2 text-xs text-zinc-500">Try clearing search, switching filter, or turning off focus mode.</p></div>}
    </div>
  </div>;
}

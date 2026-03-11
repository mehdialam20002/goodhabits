"use client";

import { Quote, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

const MILESTONES = [3, 7, 14, 30, 60];
const QUOTES = [
  "Small daily wins are easier to repeat than dramatic weekend resets.",
  "Consistency becomes visible only after you stop negotiating with the routine.",
  "Momentum is usually built by the habit you almost skipped.",
  "Make today lighter to start, then harder to quit halfway through.",
  "The best routine is the one that still works on low-energy days.",
];

function playSignal() {
  try {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 720;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.09);
  } catch {}
}

export default function DashboardCompanion({
  completed,
  total,
  progressPercent,
  streakDays,
}: {
  completed: number;
  total: number;
  progressPercent: number;
  streakDays: number;
}) {
  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);
  const scoreBreakdown = [
    { label: "Completion", value: `${progressPercent}%` },
    { label: "Finished", value: `${completed}/${total || 0}` },
    { label: "Streak", value: `${streakDays}d` },
  ];

  useEffect(() => {
    const isMilestone = MILESTONES.includes(streakDays);
    const lastCelebrated = Number(window.localStorage.getItem("aura-last-streak-celebrated") ?? "0");
    if (!isMilestone || streakDays === lastCelebrated) return;

    window.localStorage.setItem("aura-last-streak-celebrated", String(streakDays));
    playSignal();
    if ("vibrate" in navigator) navigator.vibrate([180, 80, 180]);
    toast.success(`${streakDays}-day streak milestone unlocked.`);
  }, [streakDays]);

  return (
    <div className="space-y-6">
      {MILESTONES.includes(streakDays) && (
        <div className="rounded-[2rem] border border-emerald-200 bg-linear-to-br from-emerald-100 to-teal-50 p-5 text-emerald-950 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-teal-500/5 dark:text-emerald-100">
          <p className="text-[10px] font-black uppercase tracking-[0.22em]">Milestone reached</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black">{streakDays}-day streak</p>
              <p className="text-sm opacity-80">Strong momentum window. Keep today simple and repeatable.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Today Score</p>
            <h3 className="mt-2 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{progressPercent}%</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {scoreBreakdown.map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
              <p className="mt-2 text-sm font-black text-zinc-900 dark:text-zinc-100">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Daily Quote</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">Simple prompt for today&apos;s execution.</p>
          </div>
        </div>
        <p className="mt-5 text-xl font-bold leading-relaxed text-zinc-900 dark:text-zinc-100">{quote}</p>
      </div>
    </div>
  );
}

"use client";

import { AlarmClock, Quote, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const MILESTONES = [3, 7, 14, 30, 60];
const QUOTES = [
  "Small daily wins are easier to repeat than dramatic weekend resets.",
  "Consistency becomes visible only after you stop negotiating with the routine.",
  "Momentum is usually built by the habit you almost skipped.",
  "Make today lighter to start, then harder to quit halfway through.",
  "The best routine is the one that still works on low-energy days.",
];

function playSignal(enabled: boolean) {
  if (!enabled) return;
  try {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 740;
    gain.gain.value = 0.03;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch {}
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);
  const scoreBreakdown = [
    { label: "Completion", value: `${progressPercent}%` },
    { label: "Finished", value: `${completed}/${total || 0}` },
    { label: "Streak", value: `${streakDays}d` },
  ];

  useEffect(() => {
    const stored = window.localStorage.getItem("aura-sound-enabled");
    if (stored) setSoundEnabled(stored === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aura-sound-enabled", String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current ?? undefined);
          playSignal(soundEnabled);
          if ("vibrate" in navigator) navigator.vibrate([120, 60, 120]);
          toast.success("Focus session complete.");
          setRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, soundEnabled]);

  useEffect(() => {
    const isMilestone = MILESTONES.includes(streakDays);
    const lastCelebrated = Number(window.localStorage.getItem("aura-last-streak-celebrated") ?? "0");
    if (!isMilestone || streakDays === lastCelebrated) return;

    window.localStorage.setItem("aura-last-streak-celebrated", String(streakDays));
    playSignal(soundEnabled);
    if ("vibrate" in navigator) navigator.vibrate([180, 80, 180]);
    toast.success(`${streakDays}-day streak milestone unlocked.`);
  }, [soundEnabled, streakDays]);

  const setPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      {MILESTONES.includes(streakDays) && (
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
          <p className="text-[10px] font-black uppercase tracking-[0.22em]">Milestone reached</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black">{streakDays}-day streak</p>
              <p className="text-sm opacity-80">Keep the chain alive today. You are in a real momentum window.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Today Score</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{progressPercent}%</h3>
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
            <p className="mt-1 text-sm font-medium text-zinc-500">Simple prompt for today’s execution.</p>
          </div>
        </div>
        <p className="mt-5 text-lg font-bold leading-relaxed text-zinc-900 dark:text-zinc-100">{quote}</p>
      </div>

      <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300">
              <AlarmClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Focus Timer</p>
              <p className="mt-1 text-sm font-medium text-zinc-500">Short sprint before distractions pile up.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="rounded-2xl border border-zinc-200 p-3 text-zinc-500 dark:border-zinc-800"
            title="Toggle sound and haptics cues"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] bg-zinc-50 px-5 py-6 text-center dark:bg-zinc-900/60">
          <p className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{formatTime(secondsLeft)}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{running ? "Session active" : "Ready to start"}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[15, 25, 50].map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => setPreset(minutes)}
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                selectedMinutes === minutes
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-200 text-zinc-500 dark:border-zinc-800"
              }`}
            >
              {minutes} min
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRunning((prev) => !prev)}
            className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white dark:bg-cyan-500"
          >
            {running ? "Pause" : "Start Session"}
          </button>
          <button
            type="button"
            onClick={() => setPreset(selectedMinutes)}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

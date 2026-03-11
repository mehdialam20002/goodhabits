"use client";

import { AlarmClock, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function playSignal(enabled: boolean) {
  if (!enabled) return;
  try {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 760;
    gain.gain.value = 0.03;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.14);
  } catch {}
}

export default function FocusTimerStudio() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

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
          if ("vibrate" in navigator) navigator.vibrate([120, 80, 120]);
          setRunning(false);
          toast.success("Focus block complete.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, soundEnabled]);

  const setPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setRunning(false);
  };

  const progress = ((selectedMinutes * 60 - secondsLeft) / (selectedMinutes * 60)) * 100;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[3rem] border border-indigo-200/60 bg-linear-to-br from-indigo-600 via-violet-600 to-cyan-500 p-8 text-white shadow-[0_30px_120px_rgba(79,70,229,0.25)]">
        <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-black/15 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Timer Studio</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">Deep focus, full screen style.</h1>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="rounded-2xl border border-white/20 bg-white/10 p-3 text-white"
              title="Toggle sound and haptics cues"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          <div className="mt-10 rounded-[2.5rem] border border-white/15 bg-white/10 px-6 py-10 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.8rem] bg-white/15">
              <AlarmClock className="h-7 w-7" />
            </div>
            <p className="text-[clamp(4rem,16vw,10rem)] font-black leading-none tracking-[-0.06em]">{formatTime(secondsLeft)}</p>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.24em] text-white/70">{running ? "Session active" : "Ready to launch"}</p>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Presets</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[10, 15, 25, 50].map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => setPreset(minutes)}
                className={`rounded-[1.5rem] px-4 py-5 text-left ${
                  selectedMinutes === minutes
                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Focus block</p>
                <p className="mt-2 text-2xl font-black">{minutes}m</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Controls</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setRunning((prev) => !prev)}
              className="flex items-center justify-center gap-3 rounded-[1.75rem] bg-indigo-600 px-5 py-5 text-base font-black text-white shadow-lg shadow-indigo-500/20 dark:bg-cyan-500"
            >
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => setPreset(selectedMinutes)}
              className="flex items-center justify-center gap-3 rounded-[1.75rem] border border-zinc-200 px-5 py-5 text-base font-black text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </button>
            <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Mode</p>
              <p className="mt-2 text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedMinutes} minute session</p>
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] bg-zinc-50 p-5 dark:bg-zinc-900/60">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Use this page like a dedicated focus screen.</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Pick a block, hit start, and keep this open while you finish one habit without switching context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

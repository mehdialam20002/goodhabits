"use client";

import React, { useState } from "react";
import { Check, Flame, Sparkles, TrendingUp, Clock, Zap, ChevronRight, BarChart3 } from "lucide-react";

interface MockHabit {
  id: string;
  name: string;
  category: string;
  duration: string;
  streak: number;
  completed: boolean;
}

export default function InteractiveHabitMock() {
  const [habits, setHabits] = useState<MockHabit[]>([
    {
      id: "1",
      name: "90-Min Core Deep Work",
      category: "Engineering",
      duration: "90m",
      streak: 28,
      completed: true,
    },
    {
      id: "2",
      name: "System Design & Distributed Patterns",
      category: "Architecture",
      duration: "45m",
      streak: 19,
      completed: true,
    },
    {
      id: "3",
      name: "FastAPI & Microservices Telemetry",
      category: "Backend",
      duration: "30m",
      streak: 14,
      completed: false,
    },
    {
      id: "4",
      name: "Physical Conditioning & Recovery",
      category: "Health",
      duration: "60m",
      streak: 42,
      completed: true,
    },
  ]);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState(
    "High velocity observed between 09:00 AM – 11:30 AM. Evening focus drop-off reduced by 22% after implementing the 15-minute shutdown ritual."
  );

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  const regenerateInsight = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const insights = [
        "Streak continuity is at 94% across all technical rituals. Recommended: Shift deep work block 30m earlier to capture peak cognitive flow.",
        "Consistency velocity increased by 18% this sprint. Zero skipped sessions during high-workload weekdays.",
        "Habit stacking efficiency: Completing 'System Design' directly following 'Deep Work' shows a 100% adherence rate.",
      ];
      const random = insights[Math.floor(Math.random() * insights.length)];
      setAiInsight(random);
      setAiGenerating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700/60" />
            <div className="w-3 h-3 rounded-full bg-zinc-700/60" />
            <div className="w-3 h-3 rounded-full bg-zinc-700/60" />
          </div>
          <span className="text-xs font-mono text-zinc-400 pl-2">aura_orbit / live_workspace</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Telemetry Active
          </span>
          <span className="text-xs font-mono text-zinc-500">v2.4.0-prod</span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Metric Header Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
              <span>DAILY PROGRESS</span>
              <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-100">{progressPercent}%</span>
              <span className="text-xs text-zinc-500">({completedCount}/{habits.length})</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
              <span>LONGEST STREAK</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-400">42</span>
              <span className="text-xs text-zinc-500">days</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Unbroken discipline</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
              <span>FOCUS DURATION</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-sky-400">3.75</span>
              <span className="text-xs text-zinc-500">hrs</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14% vs avg
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
              <span>CONSISTENCY SCORE</span>
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-indigo-300">96.4</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Top 2% of builders</span>
          </div>
        </div>

        {/* Interactive Habit List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Active Daily Rituals (Click to toggle)
            </h4>
            <span className="text-xs font-mono text-zinc-500">Tap item to test live state</span>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                  habit.completed
                    ? "bg-zinc-900/30 border-zinc-800/60 text-zinc-300 hover:border-zinc-700/80"
                    : "bg-zinc-900/70 border-zinc-700/50 text-zinc-100 hover:border-emerald-500/40 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      habit.completed
                        ? "bg-emerald-500 border-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                        : "border-zinc-700 bg-zinc-800/50 group-hover:border-zinc-500"
                    }`}
                  >
                    {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium transition-all ${
                        habit.completed ? "line-through text-zinc-500" : "text-zinc-100"
                      }`}
                    >
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/60">
                        {habit.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {habit.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{habit.streak}d</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini AI Weekly Debrief Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-purple-950/30 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wider">
                    Gemini AI Pattern Intelligence
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Live Synthesis
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {aiInsight}
                </p>
              </div>
            </div>

            <button
              onClick={regenerateInsight}
              disabled={aiGenerating}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono border border-zinc-700 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${aiGenerating ? "animate-spin" : ""}`} />
              <span>{aiGenerating ? "Thinking..." : "Re-evaluate"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

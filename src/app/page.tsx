import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Lock,
  Flame,
  Clock,
  Terminal,
  ArrowUpRight,
  GitBranch,
  BarChart2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import InteractiveHabitMock from "@/components/InteractiveHabitMock";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans relative overflow-x-hidden">
      {/* Subtle Technical Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Subtle Radial Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-emerald-500/5 blur-[160px] pointer-events-none -z-10" />

      <Navbar session={session} />

      <main className="relative pt-24 pb-20">
        {/* Hero Section */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm hover:border-zinc-700 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aura Orbit v2.4</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">Gemini Behavioral Synthesis Engine</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 font-sans leading-[1.1]">
              Engineered for consistency. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                Powered by habit intelligence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              A precision routine management platform for high-output engineers. Track atomic rituals, eliminate cognitive drift, and analyze consistency patterns with Gemini AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href={session ? "/dashboard" : "/auth/login"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-semibold text-sm transition-all shadow-xl shadow-emerald-500/5 flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="https://github.com/mehdialam20002/goodhabits"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 font-mono text-sm transition-all flex items-center justify-center gap-2"
              >
                <GitBranch className="w-4 h-4 text-zinc-500" />
                <span>GitHub Repository</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </Link>
            </div>

            {/* Mini Trust Tags */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Next.js 16 App Router
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PostgreSQL Row-Level Security
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Sub-50ms Optimistic Updates
              </span>
            </div>
          </div>

          {/* Interactive Live Product Preview */}
          <div className="relative mt-12">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-indigo-500/20 blur-xl opacity-50 pointer-events-none" />
            <InteractiveHabitMock />
          </div>
        </section>

        {/* Technical Architecture Specs Bar */}
        <section id="architecture" className="py-16 border-y border-zinc-800/80 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">ENGINEERING ARCHITECTURE</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 mt-2 font-mono">
                Production-Grade System Design
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Database,
                  title: "PostgreSQL & Prisma",
                  metric: "Per-User RLS Isolation",
                  desc: "Strict data encapsulation with indexed relational schemas ensuring instant habit lookups and zero query leakage.",
                },
                {
                  icon: Cpu,
                  title: "Gemini AI Synthesis",
                  metric: "Automated Debriefs",
                  desc: "Weekly behavioral telemetry processed through Gemini models to surface fatigue thresholds and peak execution windows.",
                },
                {
                  icon: Layers,
                  title: "Next.js Server Actions",
                  metric: "< 50ms Telemetry",
                  desc: "Client-side optimistic mutations backed by atomic database transactions with instant rollback capability.",
                },
                {
                  icon: Lock,
                  title: "Razorpay Billing",
                  metric: "Webhook Idempotency",
                  desc: "Subscription lifecycle management using cryptographic HMAC-SHA256 signature verification for automated pro tiers.",
                },
              ].map((arch, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center">
                      <arch.icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">
                      {arch.metric}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold font-mono text-zinc-200">{arch.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{arch.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Product Capabilities */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">CAPABILITIES</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-mono">
              Designed for Flow State Execution
            </h2>
            <p className="text-sm text-zinc-400">
              Every interaction is calibrated to minimize friction and reward disciplined daily execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-mono">Streak Momentum & Protection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Atomic check-ins with multi-frequency scheduling (daily, weekday-only, or periodic). Includes streak freeze buffers to maintain psychological momentum during planned recovery periods.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero accidental streak resets</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-mono">Integrated Focus Studio</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Built-in Pomodoro and deep work timers directly tethered to your habit log. Start a focus session, minimize cognitive switching, and have duration automatically attributed to relevant rituals.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-sky-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synchronized focus logs</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-mono">Gemini AI Synthesis</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated weekly intelligence debriefs that uncover non-obvious correlations between your habits, daily completion timing, focus blocks, and consistency drop-offs.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Context-aware recommendations</span>
              </div>
            </div>
          </div>
        </section>

        {/* Compounding Math Methodology Section */}
        <section id="methodology" className="py-20 border-t border-zinc-800/80 bg-zinc-900/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>THE COMPOUND DISCIPLINE THEOREM</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                  1% Better Daily = 37.78x Yearly Compounding
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Habits are the compound interest of self-improvement. By tracking atomic rituals daily without cognitive friction, you transition from chaotic bursts of motivation to predictable compounding velocity.
                </p>
                <div className="flex items-center gap-6 pt-2 font-mono text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold text-base">1.01³⁶⁵ = 37.8x</span>
                    <p className="text-zinc-500">Consistent Execution</p>
                  </div>
                  <div className="w-px h-8 bg-zinc-800" />
                  <div>
                    <span className="text-red-400 font-bold text-base">0.99³⁶⁵ = 0.03x</span>
                    <p className="text-zinc-500">Drift & Neglect</p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link
                  href={session ? "/dashboard" : "/auth/login"}
                  className="w-full md:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                  <span>Initialize Your Protocol</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Bio / Portfolio Link */}
        <section className="py-16 max-w-4xl mx-auto px-4 text-center">
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <p className="text-xs font-mono text-zinc-400">
                Crafted by <span className="text-zinc-100 font-semibold">Mehdi Alam</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                Full Stack Software Engineer &bull; Next.js &bull; Python/FastAPI &bull; PostgreSQL
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="https://mehdiiialam.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <span>Portfolio</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </Link>
              <Link
                href="https://github.com/mehdialam20002"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/60 text-center text-xs font-mono text-zinc-500 space-y-4">
        <div className="flex justify-center gap-8 text-zinc-400">
          <Link href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-200 transition-colors">Terms of Service</Link>
          <Link href="https://github.com/mehdialam20002/goodhabits" target="_blank" rel="noreferrer" className="hover:text-zinc-200 transition-colors">Source Code</Link>
        </div>
        <p className="text-[11px] text-zinc-600">
          Aura Orbit &bull; Habit Intelligence Engine &copy; {new Date().getFullYear()} Mehdi Alam. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

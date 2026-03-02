import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck, CheckCircle2, Layout, Smartphone, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden relative">
      {/* Background Aura Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-500/10 rounded-full blur-[200px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[200px] animate-pulse-slow delay-1000" />
      </div>

      <Navbar session={session} />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
          <div className="max-w-7xl mx-auto text-center space-y-10 animate-zen-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Elite Habit Protocol 2.0
            </div>

            <h1 className="text-6xl md:text-9xl font-bold tracking-tight italic">
              Master Your <br />
              <span className="text-gradient">Daily Aura</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Aura isn't just a tracker. It's structural intelligence for high-performers. Build routines that stick with <span className="text-zinc-900 dark:text-zinc-100">AI-driven mastery</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href={session ? "/dashboard" : "/auth/login"}
                className="px-10 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold text-sm tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl"
              >
                Start Your Protocol
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="px-10 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/5 dark:bg-zinc-900/5 backdrop-blur-md font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-20 border-y border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center items-center">
            {[
              { label: "Active Protocol users", value: "10K+" },
              { label: "Habits tracked daily", value: "250K+" },
              { label: "Focus consistency", value: "98%" },
              { label: "Mindful insights", value: "∞" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl md:text-4xl font-bold italic text-gradient">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight italic">Structural Intelligence</h2>
              <p className="text-zinc-500 max-w-xl mx-auto font-medium">Every feature is engineered to eliminate friction and maximize your momentum.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Gemini AI Oracle",
                  desc: "Real-time, actionable insights that analyze your routine and suggest refinements."
                },
                {
                  icon: Layout,
                  title: "Mindful Interface",
                  desc: "A distraction-free Zen workspace designed for absolute focus and daily clarity."
                },
                {
                  icon: Zap,
                  title: "Interactive Flow",
                  desc: "Dynamic progress visualization and optimistic tracking for instant gratification."
                }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 soft-shadow group hover:border-accent/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 border border-accent/20 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 italic">{feature.title}</h3>
                  <p className="text-zinc-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal CTA */}
        <section className="py-32 px-4 relative">
          <div className="max-w-4xl mx-auto p-16 rounded-[4rem] bg-zinc-900 text-zinc-50 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 aura-glow opacity-20 blur-[100px] -mr-48 -mt-48" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic mb-8 relative z-10">Ready to unlock your <br /> highest potential?</h2>
            <Link
              href={session ? "/dashboard" : "/auth/login"}
              className="inline-flex px-12 py-5 rounded-2xl bg-zinc-50 text-zinc-900 font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all relative z-10"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-8">
        <div className="flex justify-center gap-10">
          <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors">Privacy</Link>
          <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors">Terms</Link>
          <Link href="https://twitter.com" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors">Twitter</Link>
        </div>
        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.5em]">
          Aura &bull; The Zen Protocol &copy; 2026
        </p>
      </footer>
    </div>
  );
}

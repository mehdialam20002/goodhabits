import ActivateButton from "@/components/ActivateButton";
import { authOptions } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function SubscriptionPage() {
  const session: any = await getServerSession(authOptions);
  const isSubscribed = session?.user?.isSubscribed || false;

  const pillars = [
    {
      icon: Zap,
      title: "Faster daily execution",
      desc: "Unlimited habits, focus workflows, stronger tracking, and fewer clicks between planning and doing.",
    },
    {
      icon: Sparkles,
      title: "Smarter feedback",
      desc: "AI insights, review blocks, achievement tracking, and cleaner performance visibility.",
    },
    {
      icon: Target,
      title: "More control",
      desc: "Priority habits, exportable analytics, habit radar, and a more serious personal operating system.",
    },
  ];

  const inclusions = [
    "Unlimited habit tracking",
    "AI-powered mindful insights",
    "Advanced data visualization",
    "Priority routine coaching",
    "Exportable review reports",
    "Achievement tracking",
    "Focus mode and priority workflows",
    "Lifetime access, one-time payment",
  ];

  const comparisons = [
    { label: "Free", value: "Basic tracking, capped workflow" },
    { label: "Pro", value: "Complete system with analytics, AI, export, focus" },
  ];
  const socialProof = [
    { label: "3x cleaner", value: "daily review flow" },
    { label: "One-time", value: "Rs. 180 unlock" },
    { label: "Used for", value: "study, work, health" },
  ];
  const comparisonRows = [
    ["Habit cap", "Up to 10", "Unlimited"],
    ["Analytics", "Basic", "Full range + export"],
    ["AI review", "Limited", "Sharper insights"],
    ["Focus workflows", "Basic", "Priority + focus mode"],
    ["Reports", "No", "PNG, CSV, print, JSON"],
  ];
  const faqs = [
    {
      q: "Is this a subscription?",
      a: "No. Aura Pro is a one-time lifetime unlock, so there is no monthly billing pressure.",
    },
    {
      q: "What changes after upgrade?",
      a: "You unlock the full workflow layer: advanced analytics, AI reviews, better exports, unlimited habits, and cleaner focus tools.",
    },
    {
      q: "Is checkout secure?",
      a: "The UI is secure and payment-ready. Final public production launch should still add server-side Razorpay signature verification.",
    },
  ];

  return (
    <div className="relative max-w-6xl mx-auto w-full px-4 py-8 md:py-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {isSubscribed ? (
        <div className="max-w-2xl mx-auto rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 p-10 md:p-14 shadow-2xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Unlocked</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Aura Pro Is Active
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-zinc-500 text-base md:text-lg leading-relaxed">
            You already have full access to the premium workflow, analytics engine, AI guidance, and export tools.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Priority workflows", "Advanced analytics", "Lifetime access"].map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-4 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 dark:bg-zinc-100 px-8 py-4 text-sm font-black text-white dark:text-zinc-900 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-7 space-y-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 dark:bg-zinc-950/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-indigo-600 dark:text-cyan-400 shadow-sm">
                <Trophy className="h-4 w-4" />
                Lifetime Upgrade
              </div>
              <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 leading-[0.95]">
                Turn this habit tracker into a real performance system.
              </h1>
              <p className="mt-6 text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl">
                Upgrade once and unlock the complete Aura workflow: better tracking, sharper analytics, smarter AI, stronger reviews, and a cleaner daily operating experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillars.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 p-5 shadow-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">What You Unlock</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                    Everything serious users actually need
                  </h2>
                </div>
                <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-zinc-700 dark:text-zinc-200">
                  One payment. No recurring charge.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inclusions.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-900/40 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisons.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-[2rem] border p-6 ${
                    item.label === "Pro"
                      ? "border-indigo-300 bg-indigo-50/80 dark:border-cyan-500/30 dark:bg-cyan-500/5"
                      : "border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/70"
                  }`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">{item.label}</p>
                  <p className="mt-3 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {socialProof.map((item) => (
                <div key={item.label} className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{item.label}</p>
                  <p className="mt-3 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Comparison Table</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  Free vs Pro at a glance
                </h2>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 dark:border-zinc-800">
                {comparisonRows.map(([label, free, pro], index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-[1fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-sm ${
                      index !== comparisonRows.length - 1 ? "border-b border-zinc-200 dark:border-zinc-800" : ""
                    }`}
                  >
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{label}</div>
                    <div className="text-zinc-500">{free}</div>
                    <div className="font-bold text-indigo-600 dark:text-cyan-400">{pro}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">FAQ</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  Common upgrade questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-[1.75rem] border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-900/40 p-5">
                    <p className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">{item.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="rounded-[2.75rem] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden relative">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
                    Best Value
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Lifetime plan
                  </span>
                </div>

                <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Aura Pro
                </h2>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                  Built for people who want consistency, visibility, and a cleaner personal system.
                </p>

                <div className="mt-8 flex items-end gap-3">
                  <span className="text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Rs. 180</span>
                  <span className="pb-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-400">one time</span>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Unlock all premium workflow tools",
                    "No monthly billing pressure",
                    "Better analytics, export, and AI review",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 p-5">
                  <ActivateButton />
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 opacity-50">
                  <ShieldCheck className="h-4 w-4" />
                  <CreditCard className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Secure checkout
                  </span>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Launch Note</p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    UI is production-ready. Final public launch should still add proper server-side Razorpay signature verification.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <footer className="mt-20 text-center">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">
          Aura • Premium Habit Operating System
        </p>
      </footer>
    </div>
  );
}

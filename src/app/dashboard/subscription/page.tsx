import { CreditCard, Zap, CheckCircle2, ShieldCheck, Sparkles, Orbit, Trophy, Crown } from "lucide-react";
import Link from "next/link";
import ActivateButton from "@/components/ActivateButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SubscriptionPage() {
    const session: any = await getServerSession(authOptions);
    const isSubscribed = session?.user?.isSubscribed || false;

    const plans = [
        {
            name: "Aura Lifetime Flow",
            price: "₹180",
            description: "One-time payment for eternal mindfulness and tracking.",
            features: [
                "Unlimited Habit Tracking",
                "Advanced AI Mindful Insights",
                "Historical Analytics Depth",
                "Personalized Routine Coaching",
                "Priority Support Access"
            ],
            highlight: true
        }
    ];

    return (
        <div className="max-w-7xl mx-auto w-full px-4 py-20 animate-aura-reveal relative min-h-screen overflow-hidden">
            {/* Liquid Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-zinc-50 dark:bg-zinc-950">
                <div className="absolute top-[10%] -left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-aura-pulse opacity-60" />
                <div className="absolute bottom-[-10%] -right-[10%] w-[1000px] h-[1000px] bg-indigo-500/10 rounded-full blur-[200px] animate-aura-pulse delay-1000 opacity-60" />
            </div>

            <header className="mb-24 text-center stagger-1 relative flex flex-col items-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-[0_0_40px_rgba(0,245,255,0.15)] animate-float">
                    <Crown className="w-4 h-4 text-primary" />
                    Elite Membership
                </div>
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-8 bg-linear-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent italic leading-[0.9]">
                    Master Your <br /> <span className="text-primary italic drop-shadow-[0_0_30px_rgba(0,245,255,0.2)]">Inner Aura</span>
                </h1>
                <p className="text-zinc-500 max-w-3xl mx-auto font-bold text-xl leading-relaxed opacity-80">
                    Aura isn't just a tracker. It's a structure for your destiny. Join the <span className="text-zinc-900 dark:text-zinc-100">1% of high-performers</span> who master their morning rituals.
                </p>

                <div className="mt-12 flex items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black">5.0</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1">Rating</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black">10k+</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1">Users</span>
                    </div>
                </div>
            </header>

            {isSubscribed ? (
                <div className="max-w-3xl mx-auto p-20 rounded-[5rem] glass-effect border-2 border-primary/30 text-zinc-900 dark:text-white text-center shadow-[0_50px_150px_rgba(0,245,255,0.2)] stagger-2 relative overflow-hidden group hover:scale-[1.02] transition-all duration-1000">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-32 h-32 rounded-[4rem] bg-primary/10 flex items-center justify-center mx-auto mb-12 border border-primary/20 rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-primary/20">
                        <Trophy className="w-16 h-16 text-primary animate-aura-pulse" />
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter mb-6 italic text-primary drop-shadow-[0_0_20px_rgba(0,245,255,0.4)] uppercase">Alpha Access</h2>
                    <p className="text-zinc-500 font-black uppercase tracking-[0.5em] text-[12px] mb-16">
                        Welcome to the Elite Flow.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-20 py-8 rounded-full bg-primary text-zinc-900 font-black text-xs uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(0,245,255,0.4)]"
                    >
                        Enter The Sanctuary
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                    <div className="lg:col-span-5 space-y-16 stagger-2">
                        <div className="space-y-16">
                            {[
                                { icon: Zap, title: "Frictionless Momentum", desc: "Unlimited habits. Interactive charts. Your flow, zero interruptions." },
                                { icon: Sparkles, title: "Gemini Oracle Intelligence", desc: "AI feedback so accurate, it feels like it's reading your mind." },
                                { icon: Orbit, title: "Sovereign Ownership", desc: "One payment. Forever. You own your data and your growth." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-10 group relative">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 group-hover:border-primary/60 transition-all duration-700 shadow-2xl group-hover:shadow-primary/10 relative">
                                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-0 group-hover:scale-100 transition-transform duration-700" />
                                        <item.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform relative z-10" />
                                    </div>
                                    <div className="pt-3">
                                        <h3 className="text-3xl font-black mb-3 italic tracking-tight">{item.title}</h3>
                                        <p className="text-zinc-500 text-lg font-bold leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7 stagger-3 relative">
                        {/* High-End Pricing Card */}
                        <div className="absolute -inset-10 bg-primary/10 rounded-[6rem] blur-[100px] opacity-40 -z-10 animate-pulse" />

                        {plans.map((plan, i) => (
                            <div key={i} className="p-20 rounded-[5rem] bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-[6px] border-primary/20 shadow-[0_80px_160px_rgba(0,0,0,0.8)] dark:shadow-[0_80px_160px_rgba(0,245,255,0.15)] relative overflow-hidden group hover:scale-[1.01] transition-transform duration-1000 border-b-primary">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-primary/20 transition-all duration-1000" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-16">
                                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-zinc-950 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/40">
                                            LIFETIME PASS
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                                            <p className="text-sm font-black italic text-primary animate-pulse">Live Now</p>
                                        </div>
                                    </div>

                                    <h2 className="text-7xl font-black tracking-tighter mb-6 italic leading-[0.8] uppercase">{plan.name}</h2>
                                    <div className="flex items-baseline gap-4 mb-14 border-b border-white/10 dark:border-zinc-900/10 pb-10">
                                        <span className="text-9xl font-black italic text-primary drop-shadow-[0_0_30px_rgba(0,245,255,0.4)] leading-none">{plan.price}</span>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">Total</span>
                                            <span className="text-zinc-400 font-bold uppercase text-[10px]">Forever Access</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-20">
                                        {plan.features.map((feature, j) => (
                                            <div key={j} className="flex items-center gap-5 group/item">
                                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/item:border-primary group-hover/item:bg-primary/20 transition-all duration-500">
                                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-base font-bold text-zinc-400 dark:text-zinc-600 transition-colors group-hover/item:text-white dark:group-hover/item:text-zinc-950">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative pt-6">
                                        <ActivateButton />

                                        <div className="flex justify-between items-center mt-12 px-10 py-8 rounded-[3rem] bg-white/5 dark:bg-zinc-900/5 border border-white/5 dark:border-zinc-900/5 backdrop-blur-3xl">
                                            {[
                                                { icon: ShieldCheck, label: "Encrypted" },
                                                { icon: CreditCard, label: "Verified" },
                                                { icon: Sparkles, label: "Instant" }
                                            ].map((sec, k) => (
                                                <div key={k} className="flex flex-col items-center gap-2 group/sec">
                                                    <sec.icon className="w-6 h-6 text-primary/40 group-hover/sec:text-primary transition-colors" />
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover/sec:text-zinc-300 transition-colors">{sec.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <footer className="mt-40 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center stagger-1 relative">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] mb-10">
                    Proprietary <span className="text-zinc-900 dark:text-zinc-100">Prism Architecture</span> &bull; Aura Protocol 2.0
                </p>
                <div className="flex justify-center gap-10">
                    <Link href="/dashboard" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-primary transition-all">
                        Cancel Protocol
                    </Link>
                    <span className="text-zinc-800 dark:text-zinc-200">/</span>
                    <Link href="/terms" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-primary transition-all">
                        Sanctuary Terms
                    </Link>
                </div>
            </footer>
        </div>
    );
}

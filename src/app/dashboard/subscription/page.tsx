import { CreditCard, Zap, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import ActivateButton from "@/components/ActivateButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SubscriptionPage() {
    const session: any = await getServerSession(authOptions);
    const isSubscribed = session?.user?.isSubscribed || false;

    const plans = [
        {
            name: "Aura Pro Lifetime",
            price: "₹180",
            description: "One-time payment for complete routine mastery.",
            features: [
                "Unlimited Habit Tracking",
                "AI-Powered Mindful Insights",
                "Advanced Data Visualization",
                "Priority Routine Coaching",
                "One-time crystal clear pricing"
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-20 animate-zen-reveal opacity-0" style={{ animationFillMode: 'forwards' }}>
            <header className="mb-20 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 italic mb-6">
                    Professional Mastery
                </h1>
                <p className="text-zinc-500 max-w-xl mx-auto font-medium text-lg leading-relaxed">
                    Elevate your routine with structural intelligence. No subscriptions, no fluff. Just pure momentum.
                </p>
            </header>

            {isSubscribed ? (
                <div className="max-w-xl mx-auto p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 soft-shadow text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-8 border border-accent/20">
                        <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 italic">Pro Access Active</h2>
                    <p className="text-zinc-500 font-medium mb-10">You have eternal access to the Aura sanctuary.</p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-10 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-10">
                        {[
                            { icon: Zap, title: "Peak Efficiency", desc: "Unlimited habits and interactive data visualizations." },
                            { icon: Sparkles, title: "AI Intelligence", desc: "Mindful feedback powered by Gemini 2.0." },
                            { icon: ShieldCheck, title: "Complete Privacy", desc: "Your data, your routine, eternally yours." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 group">
                                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 group-hover:border-accent/40 transition-colors">
                                    <item.icon className="w-6 h-6 text-zinc-400 group-hover:text-accent transition-colors" />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h3>
                                    <p className="text-xs font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-6">
                        {plans.map((plan, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
                                <div className="mb-8">
                                    <span className="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest leading-none">Best Value</span>
                                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-4 italic">{plan.name}</h2>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">₹180</span>
                                        <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">/ Lifetime</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800">
                                    <ActivateButton />
                                    <div className="flex justify-center items-center gap-6 mt-8 opacity-40">
                                        <ShieldCheck className="w-4 h-4" />
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <footer className="mt-40 text-center">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">
                    Aura &bull; Zen Minimalist Protocol
                </p>
            </footer>
        </div>
    );
}

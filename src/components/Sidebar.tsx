"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, LineChart, BookOpen, Settings, LogOut, X, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    user: { name?: string | null; email?: string | null; image?: string | null; isSubscribed?: boolean };
}

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const navLinks = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
        { label: "Notes", href: "/dashboard/notes", icon: BookOpen },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className="w-20 lg:w-72 h-full border-r border-indigo-50/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 flex flex-col justify-between py-8 transition-all duration-500 relative">
            {/* Background Gradient Blob for Sidebar */}
            <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-indigo-50/30 dark:from-indigo-900/10 to-transparent pointer-events-none" />

            <div>
                <div className="px-8 mb-12 hidden lg:block">
                    <Link href="/" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-11 h-11 rounded-2xl aura-glow flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-cyan-400 italic">Aura</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Elite Protocol</p>
                        </div>
                    </Link>
                </div>

                <nav className="space-y-3 px-4 lg:px-6">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative ${isActive
                                    ? "bg-indigo-600 dark:bg-cyan-500 text-white shadow-xl shadow-indigo-500/20 dark:shadow-cyan-500/10"
                                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-indigo-600 dark:hover:text-cyan-400"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`} />
                                <span className={`hidden lg:block font-bold tracking-tight text-sm ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                                    {link.label}
                                </span>
                                {isActive && (
                                    <span className="ml-auto hidden lg:block w-2 h-2 rounded-full bg-white animate-aura-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {!user.isSubscribed && (
                    <div className="mt-10 px-6 hidden lg:block animate-aura-reveal">
                        <Link
                            href="/dashboard/subscription"
                            className="flex flex-col gap-5 p-7 rounded-[2.5rem] bg-zinc-900 text-zinc-50 shadow-2xl border border-white/5 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 aura-glow opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-all" />
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Upgrade Aura</p>
                                <p className="text-sm font-bold leading-tight">Unlock full lifetime <br /> access today</p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <div className="px-6">
                <div className="mb-6 hidden lg:flex items-center gap-4 px-2 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        {user?.image ? (
                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-zinc-400">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate text-zinc-900 dark:text-zinc-100 italic">{user?.name || "User"}</p>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{user.isSubscribed ? "Premium" : "Explorer"}</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-2xl text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-all group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="hidden lg:block font-bold text-sm">Exit Space</span>
                </button>
            </div>

            {/* Premium Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-aura-reveal">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-center mb-2 tracking-tight">Wait, Aura!</h3>
                        <p className="text-zinc-500 text-center mb-8 font-medium">Are you sure you want to pause your mindful flow and log out?</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 dark:shadow-none active:scale-95"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-black hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95"
                            >
                                Stay in Flow
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

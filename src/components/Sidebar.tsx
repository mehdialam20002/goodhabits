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
        <aside className="w-20 lg:w-64 h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between py-6 transition-all duration-300">
            <div>
                <div className="px-8 mb-10 hidden lg:block">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-700 group-hover:rotate-6">
                            <span className="text-zinc-900 font-black text-xl italic drop-shadow-sm">A</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-aura">Aura</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Mindful Rhythm</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 px-3 lg:px-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-700 ${isActive
                                    ? "bg-primary text-zinc-900 shadow-lg shadow-primary/20"
                                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary dark:hover:text-primary hover:shadow-md"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`} />
                                <span className={`hidden lg:block font-black tracking-tight text-sm uppercase ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
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
                    <div className="mt-8 px-4 hidden lg:block stagger-3">
                        <Link
                            href="/dashboard/subscription"
                            className="flex flex-col gap-4 p-6 rounded-[2rem] bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-xl border border-primary/20 transition-transform hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
                            <Sparkles className="w-6 h-6 animate-pulse text-primary" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Upgrade Aura</p>
                                <p className="text-sm font-black leading-tight">Unlock full lifetime access for ₹180</p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <div className="px-4">
                <div className="mb-4 hidden lg:flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-medium">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-black truncate">{user?.name || "User"}</p>
                            {user.isSubscribed && <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{user.isSubscribed ? "Premium Aura" : "Free Explorer"}</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden lg:block font-bold">Log out</span>
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

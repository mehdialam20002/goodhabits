"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard, Sparkles, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ session }: { session: any }) {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 aura-glow rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold italic tracking-tight">Aura</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    Dashboard
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-0 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl glass-effect p-2">
                                        <DropdownMenuItem className="p-3 rounded-xl cursor-not-allowed opacity-50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{session.user?.email}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="p-3 rounded-xl cursor-pointer text-red-600 dark:text-red-400 font-bold flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="hidden md:block text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

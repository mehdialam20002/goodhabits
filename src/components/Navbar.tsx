"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard, User, Github, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-mono font-bold text-sm text-zinc-100 group-hover:border-zinc-500 transition-colors shadow-sm">
                <span className="text-emerald-400">AO</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-zinc-100 font-mono">AURA ORBIT</span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider">HABIT INTELLIGENCE</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#architecture"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Architecture
              </Link>
              <Link
                href="#methodology"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="https://github.com/mehdialam20002/goodhabits"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors inline-flex items-center gap-1"
              >
                Source
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-mono flex items-center gap-2 transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  Workspace
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 p-0 hover:border-zinc-700 transition-all"
                    >
                      <User className="h-4 w-4 text-zinc-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl bg-zinc-900 border border-zinc-800 p-2 shadow-2xl">
                    <DropdownMenuItem className="p-2.5 rounded-lg cursor-not-allowed opacity-60">
                      <span className="text-[11px] font-mono text-zinc-400 truncate">{session.user?.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-2.5 rounded-lg cursor-pointer text-red-400 font-mono text-xs flex items-center gap-2 hover:bg-red-950/30"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex text-xs font-mono text-zinc-400 hover:text-zinc-200 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-semibold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Launch Workspace
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

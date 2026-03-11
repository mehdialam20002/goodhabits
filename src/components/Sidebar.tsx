"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AlertCircle,
  BookOpen,
  Crown,
  Home,
  LineChart,
  LogOut,
  Menu,
  Orbit,
  TimerReset,
  Rocket,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isSubscribed?: boolean;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navSections = [
    {
      title: "Workspace",
      links: [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
        { label: "Notes", href: "/dashboard/notes", icon: BookOpen },
        { label: "Rituals", href: "/dashboard/rituals", icon: Orbit },
        { label: "Timer", href: "/dashboard/timer", icon: TimerReset },
      ],
    },
    {
      title: "Manage",
      links: [
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
        { label: user.isSubscribed ? "Aura Pro" : "Upgrade", href: "/dashboard/subscription", icon: Rocket },
      ],
    },
  ];
  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { label: "Notes", href: "/dashboard/notes", icon: BookOpen },
    { label: "Rituals", href: "/dashboard/rituals", icon: Orbit },
    { label: "Timer", href: "/dashboard/timer", icon: TimerReset },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: user.isSubscribed ? "Aura Pro" : "Upgrade", href: "/dashboard/subscription", icon: Rocket },
  ];

  useEffect(() => {
    navLinks.forEach((link) => router.prefetch(link.href));
  }, [router]);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl aura-glow flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-black text-indigo-600 dark:text-cyan-400">Aura</h2>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed top-[70px] left-0 w-full z-40 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-semibold text-sm">{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}

      <aside className="hidden lg:flex w-72 h-screen border-r border-indigo-50/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 flex-col justify-between py-8 relative">
        <div>
          <div className="px-8 mb-12">
            <Link href="/" prefetch className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl aura-glow flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-indigo-600 dark:text-cyan-400 italic">Aura</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Elite Protocol
                </p>
              </div>
            </Link>
          </div>

          <div className="mx-6 mb-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">Account</p>
                <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {user.name || "Aura User"}
                </p>
                <p className="text-xs text-zinc-500 break-all">{user.email || "No email"}</p>
              </div>
              <div
                className={`rounded-2xl p-3 ${
                  user.isSubscribed
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
                    : "bg-indigo-100 text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300"
                }`}
              >
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {user.isSubscribed ? "Aura Pro Active" : "Free Explorer"}
            </p>
          </div>

          <div className="space-y-6 px-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="px-4 pb-3 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  {section.title}
                </p>
                <nav className="space-y-3">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch
                        className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg dark:bg-cyan-500"
                            : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600 dark:hover:bg-zinc-900 dark:hover:text-cyan-400"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon size={18} />
                          <span className="font-bold text-sm">{link.label}</span>
                        </div>
                        {link.href === "/dashboard/subscription" && !user.isSubscribed && (
                          <span className="rounded-full bg-white/20 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-current">
                            Pro
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition"
          >
            <LogOut size={18} />
            Exit Space
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-2xl font-black text-center mb-2">Confirm Logout</h3>
            <p className="text-zinc-500 text-center mb-8">Are you sure you want to leave?</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition active:scale-95"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 font-black active:scale-95"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

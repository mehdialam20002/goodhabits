"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, CalendarRange, Globe, Goal, MoonStar, Smartphone, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type Preferences = {
  theme: string;
  language: string;
  weekStart: string;
  reminderTime: string;
  reminderChannel: string;
  streakMode: string;
  accountabilityName: string;
  accountabilityContact: string;
  dailyReview: boolean;
  focusFirst: boolean;
};

const defaultPrefs: Preferences = {
  theme: "system",
  language: "en-IN",
  weekStart: "monday",
  reminderTime: "20:00",
  reminderChannel: "browser",
  streakMode: "any-completion",
  accountabilityName: "",
  accountabilityContact: "",
  dailyReview: true,
  focusFirst: true,
};

export default function SettingsWorkspace() {
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
  const { setTheme } = useTheme();

  useEffect(() => {
    const stored = window.localStorage.getItem("aura-preferences");
    if (!stored) return;
    try {
      setPrefs({ ...defaultPrefs, ...JSON.parse(stored) });
    } catch {
      setPrefs(defaultPrefs);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aura-preferences", JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    setTheme(prefs.theme);
  }, [prefs.theme, setTheme]);

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser notifications are not supported here.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") toast.success("Browser reminders enabled.");
    else toast.error("Notification permission was not granted.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Display", icon: MoonStar, value: prefs.theme, keyName: "theme", options: [["system", "System"], ["light", "Light"], ["dark", "Dark"]] },
          { title: "Language", icon: Globe, value: prefs.language, keyName: "language", options: [["en-IN", "English (India)"], ["en-US", "English (US)"], ["hi-IN", "Hindi"]] },
          { title: "Review Cycle", icon: CalendarRange, value: prefs.weekStart, keyName: "weekStart", options: [["monday", "Monday"], ["sunday", "Sunday"]] },
          { title: "Streak Logic", icon: Goal, value: prefs.streakMode, keyName: "streakMode", options: [["any-completion", "Any completion"], ["priority-complete", "All priority habits"], ["all-complete", "All habits complete"]] },
        ].map((card) => (
          <div key={card.title} className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight">{card.title}</h3>
            </div>
            <Select value={card.value} onValueChange={(value) => update(card.keyName as keyof Preferences, value)}>
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder={card.title} />
              </SelectTrigger>
              <SelectContent>
                {card.options.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Reminders</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="time"
            value={prefs.reminderTime}
            onChange={(e) => update("reminderTime", e.target.value)}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm"
          />
          <Select value={prefs.reminderChannel} onValueChange={(value) => update("reminderChannel", value)}>
            <SelectTrigger className="w-full rounded-2xl">
              <SelectValue placeholder="Reminder channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="browser">Browser</SelectItem>
              <SelectItem value="email">Email planning</SelectItem>
              <SelectItem value="whatsapp">WhatsApp planning</SelectItem>
            </SelectContent>
          </Select>
          <button type="button" onClick={enableNotifications} className="rounded-2xl bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm font-black text-white dark:text-zinc-900">
            Enable Browser Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Accountability</h3>
          </div>
          <input value={prefs.accountabilityName} onChange={(e) => update("accountabilityName", e.target.value)} placeholder="Partner or mentor name" className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm" />
          <input value={prefs.accountabilityContact} onChange={(e) => update("accountabilityContact", e.target.value)} placeholder="Email or WhatsApp number" className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm" />
        </div>

        <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Workflow Defaults</h3>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <Checkbox checked={prefs.dailyReview} onCheckedChange={(checked) => update("dailyReview", Boolean(checked))} />
            <span className="text-sm font-medium">Show daily review prompts automatically</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <Checkbox checked={prefs.focusFirst} onCheckedChange={(checked) => update("focusFirst", Boolean(checked))} />
            <span className="text-sm font-medium">Start each day in focus mode</span>
          </label>
        </div>
      </div>
    </div>
  );
}

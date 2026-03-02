import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Shield, Bell, Palette, Globe } from "lucide-react";

export default async function SettingsPage() {
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const user = session.user;

    const sections = [
        {
            title: "Profile Information",
            description: "Update your personal details and how others see you.",
            icon: User,
            fields: [
                { label: "Display Name", value: user?.name || "Not set" },
                { label: "Email Address", value: user?.email || "Not set" },
            ]
        },
        {
            title: "Security",
            description: "Manage your account security and authentication methods.",
            icon: Shield,
            fields: [
                { label: "Authentication", value: "PostgreSQL + NextAuth" },
                { label: "Password", value: "••••••••••••" },
            ]
        },
        {
            title: "Preferences",
            description: "Customize your experience and notification settings.",
            icon: Palette,
            fields: [
                { label: "Theme", value: "System Default" },
                { label: "Language", value: "English (US)" },
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto w-full animate-aura-reveal opacity-0" style={{ animationFillMode: 'forwards' }}>
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 stagger-1">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-aura">Aura Settings</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Personalize your mindful experience.</p>
                </div>
            </header>

            <div className="space-y-6">
                {sections.map((section, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] glass-effect border border-zinc-200 dark:border-zinc-800 soft-shadow transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-[2rem] bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 dark:shadow-none">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black tracking-tight mb-1">{section.title}</h3>
                                <p className="text-sm font-medium text-zinc-400 mb-8">{section.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.fields.map((field, j) => (
                                        <div key={j} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                                            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm font-medium">
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-10 rounded-[3rem] bg-indigo-500 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-100 dark:shadow-none stagger-3 animate-float overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="text-center md:text-left relative z-10">
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Explore the Aura</h3>
                        <p className="text-indigo-100 font-medium">Need deep guidance? Our mindful support is here.</p>
                    </div>
                    <button className="px-10 py-4 rounded-2xl bg-white text-indigo-500 font-black text-sm transition-transform active:scale-95 shadow-xl hover:scale-105 duration-300 relative z-10">
                        Contact Aura Support
                    </button>
                </div>
            </div>
        </div>
    );
}

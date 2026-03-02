"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error("Invalid credentials.");
            } else {
                toast.success("Successfully logged in!");
                window.location.href = "/dashboard";
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Aura Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow delay-700" />
            </div>

            <Card className="w-full max-w-sm glass-card border-zinc-200 dark:border-zinc-800 soft-shadow rounded-3xl overflow-hidden relative z-10 animate-zen-reveal">
                <CardHeader className="space-y-1 text-center pb-8 pt-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 aura-glow p-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight italic">Aura Sanctuary</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                        Enter your private growth space.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-10 pb-10">
                    <Button
                        variant="outline"
                        className="w-full h-12 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-2xl font-bold text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-all flex items-center gap-3"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Google Gateway
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em] leading-none">
                            <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-300">
                                identity verify
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleCredentialsLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Universal Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="..."
                                required
                                className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-5 text-sm font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Secure Passkey</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-5 text-sm font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full h-12 rounded-2xl mt-5 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold text-sm tracking-tight shadow-lg shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit" disabled={loading}>
                            {loading ? "Authenticating..." : "Synchronize Session"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

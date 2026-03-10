"use client";

import { activateUserSubscription } from "@/app/actions/subscription";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ActivateButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRazorpayPayment = async () => {
    setIsLoading(true);

    try {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!key || key === "rzp_test_PASTE_YOUR_KEY_HERE") {
        toast.error("Add your real Razorpay key in .env before taking payments.");
        setIsLoading(false);
        return;
      }

      const options = {
        key,
        amount: 18000,
        currency: "INR",
        name: "Aura Habit Tracker",
        description: "Lifetime Premium Access",
        image: "https://your-logo-url.com",
        handler: async function (response: any) {
          toast.loading("Verifying transaction and activating Aura...");

          try {
            await activateUserSubscription();
            toast.success("Aura Premium Activated!");
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } catch {
            toast.error(`Activation failed. Support ID: ${response.razorpay_payment_id}`);
          }
        },
        prefill: {
          name: "Habit Tracker User",
          email: "user@example.com",
        },
        theme: {
          color: "#00F5FF",
        },
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        toast.error("Razorpay SDK not loaded. Please refresh the page.");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Could not start payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRazorpayPayment}
        disabled={isLoading}
        className="w-full rounded-[1.75rem] bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-5 py-5 transition-all hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] active:scale-[0.99] shadow-[0_12px_30px_rgba(0,0,0,0.14)] disabled:opacity-50 group relative border border-zinc-900/90 dark:border-white/80"
      >
        <div className="absolute inset-0 rounded-[1.75rem] bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[110%] transition-transform duration-1000" />
        {isLoading ? (
          <div className="flex w-full items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Starting secure checkout...</span>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 dark:bg-zinc-950/10 border border-white/10 dark:border-zinc-900/10">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] font-black text-white/55 dark:text-zinc-950/55">
                  Lifetime upgrade
                </div>
                <div className="mt-1 text-2xl leading-none font-black">Secure Upgrade</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.24em] font-black text-white/55 dark:text-zinc-950/55">
                One time
              </div>
              <div className="mt-1 text-2xl leading-none font-black">Rs. 180</div>
            </div>
          </div>
        )}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, label: "Protected checkout" },
          { icon: CheckCircle2, label: "Lifetime unlock" },
          { icon: Sparkles, label: "AI + analytics bundle" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs font-bold text-zinc-500 flex items-center gap-2">
            <item.icon className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

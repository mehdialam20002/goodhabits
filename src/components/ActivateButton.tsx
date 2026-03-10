"use client";

import { useState } from "react";
import { activateUserSubscription } from "@/app/actions/subscription";
import { toast } from "sonner";
import { CreditCard, Loader2, Sparkles } from "lucide-react";

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
                toast.error("Bhai, aapne .env mein real Razorpay Key ID nahi daala hai! Placeholder key se payment fail ho jayegi.");
                setIsLoading(false);
                return;
            }

            const options = {
                key: key,
                amount: 10, // Amount in paise (₹180 = 18000)
                currency: "INR",
                name: "Aura Habit Tracker",
                description: "Lifetime Premium Access",
                image: "https://your-logo-url.com", // Optional Logo
                handler: async function (response: any) {
                    // This function runs ONLY after SUCCESSFUL payment
                    console.log("Payment Success:", response.razorpay_payment_id);
                    toast.loading("Verifying transaction and activating Aura...");

                    try {
                        await activateUserSubscription();
                        toast.success("Aura Premium Activated! Welcome to the flow. 💎🚀");
                        setTimeout(() => {
                            window.location.href = "/dashboard";
                        }, 1500);
                    } catch (error) {
                        toast.error("Activation failed. Please contact support with ID: " + response.razorpay_payment_id);
                    }
                },
                prefill: {
                    name: "Habit Tracker User",
                    email: "user@example.com",
                },
                theme: {
                    color: "#00F5FF", // Electric Cyan to match Prism Slate
                },
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
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
        <button
            onClick={handleRazorpayPayment}
            disabled={isLoading}
            className="w-full py-5 rounded-[2.5rem] bg-primary text-zinc-900 font-black text-lg transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 group overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <>
                    <CreditCard className="w-6 h-6" />
                    Secure Upgrade (₹180)
                </>
            )}
        </button>
    );
}

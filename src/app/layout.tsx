import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Habit Tracker | Premium Dashboard",
  description: "A world-class SaaS habit tracking application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster />
          <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        </AuthProvider>
      </body>
    </html>
  );
}

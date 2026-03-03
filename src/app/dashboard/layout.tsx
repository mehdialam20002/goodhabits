import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    return (
         <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
  <Sidebar user={session.user} />

  <main className="flex-1 overflow-y-auto px-4 pt-24 pb-8 md:px-8 lg:px-12 xl:px-24 lg:pt-8">
    {children}
  </main>
</div>
    );
}

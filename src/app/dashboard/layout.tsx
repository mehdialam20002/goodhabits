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
               <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
  
  {/* Sidebar */}
  <div className="md:w-64 md:shrink-0">
    <Sidebar user={session.user} />
  </div>

  {/* Main Content */}
  <main className="page-shell flex-1 w-full px-3 py-4 md:px-8 md:py-6 mt-20 lg:px-12 xl:px-20 overflow-x-hidden">
    {children}
  </main>

</div>
    );
}

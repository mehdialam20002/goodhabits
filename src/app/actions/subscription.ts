"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function activateUserSubscription() {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { isSubscribed: true }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscription");
    revalidatePath("/dashboard/analytics");

    return { success: true };
}

"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNoteByDate(date: string) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    return await prisma.note.findUnique({
        where: {
            userId_date: {
                userId: session.user.id,
                date,
            },
        },
    });
}

export async function saveNote(date: string, content: string) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Safety Sync: Ensure the user exists in the DB to prevent Foreign Key errors
    const user = await prisma.user.upsert({
        where: { email: session.user.email },
        update: {},
        create: {
            email: session.user.email,
            name: session.user.name || "User",
        },
    });

    await prisma.note.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date,
            },
        },
        update: {
            content,
        },
        create: {
            userId: user.id,
            date,
            content,
        },
    });

    revalidatePath("/dashboard/notes");
}

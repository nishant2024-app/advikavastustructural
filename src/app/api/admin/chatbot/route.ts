import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const sessions = await prisma.chatSession.findMany({
            include: { messages: { orderBy: { createdAt: "asc" } } },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        return NextResponse.json(sessions);
    } catch {
        return apiError("Failed to fetch chat sessions");
    }
}
export async function DELETE(req: Request) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return apiError("Session ID is required", 400);

        await prisma.chatSession.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/admin/chatbot error:", error);
        return apiError("Failed to delete chat session");
    }
}

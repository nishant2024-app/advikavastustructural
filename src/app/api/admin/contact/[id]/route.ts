import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        const body = await req.json();
        const submission = await prisma.contactSubmission.update({ where: { id }, data: { isRead: body.isRead ?? true } });
        return NextResponse.json(submission);
    } catch {
        return apiError("Failed to update submission");
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        await prisma.contactSubmission.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return apiError("Failed to delete submission");
    }
}

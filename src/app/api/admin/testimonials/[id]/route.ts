import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, sanitizeObject, apiError } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        const body = await req.json();
        const sanitized = sanitizeObject(body, ["name", "content", "role", "company"]);
        const testimonial = await prisma.testimonial.update({ where: { id }, data: sanitized });
        return NextResponse.json(testimonial);
    } catch {
        return apiError("Failed to update testimonial");
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        await prisma.testimonial.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return apiError("Failed to delete testimonial");
    }
}

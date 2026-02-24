import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, sanitizeObject, apiError } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        const body = await req.json();
        const updateData = {
            ...sanitizeObject(body, ["name", "description", "price", "originalPrice", "imageUrl", "category", "area", "direction", "bhk", "vastu", "code"]),
            floors: body.floors !== undefined ? (body.floors ? parseInt(body.floors.toString()) : null) : undefined,
            width: body.width !== undefined ? (body.width ? parseFloat(body.width.toString()) : null) : undefined,
            depth: body.depth !== undefined ? (body.depth ? parseFloat(body.depth.toString()) : null) : undefined,
            isVisible: body.isVisible,
            order: body.order,
        };
        // Remove undefined values to avoid overwriting with undefined
        Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

        const product = await prisma.product.update({ where: { id }, data: updateData });
        return NextResponse.json(product);
    } catch {
        return apiError("Failed to update product");
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const { id } = await params;
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return apiError("Failed to delete product");
    }
}

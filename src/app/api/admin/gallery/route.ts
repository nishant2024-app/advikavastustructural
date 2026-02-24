import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const categories = await prisma.galleryCategory.findMany({
            orderBy: { order: "asc" },
        });

        const items = await prisma.galleryItem.findMany({
            include: { category: true },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ items, categories });
    } catch (error) {
        console.error("Gallery fetch error:", error);
        return apiError("Failed to fetch gallery");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["categoryId"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["title", "description", "imageUrl"]);
        const item = await prisma.galleryItem.create({
            data: {
                title: sanitized.title || "New Item",
                description: sanitized.description || "",
                imageUrl: sanitized.imageUrl || "",
                categoryId: body.categoryId,
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(item, { status: 201 });
    } catch {
        return apiError("Failed to create gallery item");
    }
}

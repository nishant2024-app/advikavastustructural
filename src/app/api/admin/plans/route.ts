import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const plans = await prisma.plan.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(plans);
    } catch {
        return apiError("Failed to fetch plans");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["name", "price"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["name", "description"]);
        const plan = await prisma.plan.create({
            data: {
                name: sanitized.name,
                slug: sanitized.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                description: sanitized.description || "",
                price: body.price,
                features: body.features || [],
                timeline: body.timeline || "",
                isFeatured: body.isFeatured ?? false,
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(plan, { status: 201 });
    } catch {
        return apiError("Failed to create plan");
    }
}

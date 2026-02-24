import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(services);
    } catch {
        return apiError("Failed to fetch services");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const body = await req.json();
        const { valid, errorResponse: validationError } = validateFields(body, ["title"]);
        if (!valid) return validationError;

        const sanitized = sanitizeObject(body, ["title", "description", "price", "originalPrice", "sampleImageUrl", "icon"]);
        const slugBase = sanitized.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const service = await prisma.service.create({
            data: {
                title: sanitized.title,
                slug: `${slugBase}-${Date.now()}`,
                description: sanitized.description || "",
                icon: sanitized.icon || "📋",
                price: sanitized.price || null,
                originalPrice: sanitized.originalPrice || null,
                sampleImageUrl: sanitized.sampleImageUrl || null,
                inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
                processSteps: Array.isArray(body.processSteps) ? body.processSteps : [],
                deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return apiError("Failed to create service");
    }
}

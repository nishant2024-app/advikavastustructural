import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(testimonials);
    } catch {
        return apiError("Failed to fetch testimonials");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["name", "content"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["name", "content", "role", "company"]);
        const testimonial = await prisma.testimonial.create({
            data: {
                name: sanitized.name,
                role: sanitized.role || "",
                company: sanitized.company || "",
                content: sanitized.content,
                rating: body.rating ?? 5,
                imageUrl: body.imageUrl || "",
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(testimonial, { status: 201 });
    } catch {
        return apiError("Failed to create testimonial");
    }
}

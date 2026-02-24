import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const sections = await prisma.ctaSection.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(sections);
    } catch {
        return apiError("Failed to fetch CTA sections");
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();

        if (body.id) {
            const section = await prisma.ctaSection.update({
                where: { id: body.id },
                data: {
                    headline: body.headline,
                    subtext: body.subtext,
                    buttonText: body.buttonText,
                    buttonUrl: body.buttonUrl,
                    isVisible: body.isVisible ?? true,
                },
            });
            return NextResponse.json(section);
        }

        // Upsert first CTA section
        const existing = await prisma.ctaSection.findFirst();
        if (existing) {
            const section = await prisma.ctaSection.update({
                where: { id: existing.id },
                data: {
                    headline: body.headline,
                    subtext: body.subtext,
                    buttonText: body.buttonText,
                    buttonUrl: body.buttonUrl,
                    isVisible: body.isVisible ?? true,
                },
            });
            return NextResponse.json(section);
        }

        const section = await prisma.ctaSection.create({
            data: {
                headline: body.headline || "Get Your Dream Project Started",
                subtext: body.subtext || "",
                buttonText: body.buttonText || "Get Started",
                buttonUrl: body.buttonUrl || "/contact",
            },
        });
        return NextResponse.json(section, { status: 201 });
    } catch {
        return apiError("Failed to update CTA section");
    }
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const pages = await prisma.legalPage.findMany();
        return NextResponse.json(pages);
    } catch {
        return apiError("Failed to fetch legal pages");
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const page = await prisma.legalPage.update({
            where: { slug: body.slug },
            data: { title: body.title, content: body.content },
        });
        return NextResponse.json(page);
    } catch {
        return apiError("Failed to update legal page");
    }
}

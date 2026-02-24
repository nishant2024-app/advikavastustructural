import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";
import { getHomePageData } from "@/lib/data";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const homeData = await getHomePageData();
        return NextResponse.json(homeData);
    } catch (error) {
        console.error("GET /api/home error:", error);
        return apiError("Failed to fetch home page data");
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const body = await req.json();

        // Remove id and updatedAt from body
        const { id, updatedAt, ...updateData } = body;

        // @ts-ignore
        const homeData = await prisma.homePage.upsert({
            where: { id: "singleton" },
            update: updateData,
            create: {
                id: "singleton",
                ...updateData
            }
        });

        return NextResponse.json(homeData);
    } catch (error: any) {
        console.error("PUT /api/admin/home error detail:", error);
        return apiError(error.message || "Failed to update home page data");
    }
}

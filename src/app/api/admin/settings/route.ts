import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const rows = await prisma.globalSettings.findMany();
        const settings: Record<string, any> = {};
        for (const row of rows) {
            settings[row.key] = row.value;
        }
        return NextResponse.json(settings);
    } catch {
        return apiError("Failed to fetch settings");
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const results: any[] = [];
        for (const [key, value] of Object.entries(body)) {
            const result = await prisma.globalSettings.upsert({
                where: { key },
                update: { value: value as any },
                create: { key, value: value as any },
            });
            results.push(result);
        }
        return NextResponse.json({ success: true, updated: results.length });
    } catch {
        return apiError("Failed to update settings");
    }
}

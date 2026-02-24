import { NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";
import { getDashboardStats } from "@/lib/data";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const stats = await getDashboardStats();
        return NextResponse.json(stats);
    } catch {
        return apiError("Failed to fetch dashboard stats");
    }
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const calculators = await prisma.calculator.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(calculators);
    } catch {
        return apiError("Failed to fetch calculators");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["name", "formula"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["name", "description", "resultLabel", "resultUnit"]);
        const calculator = await prisma.calculator.create({
            data: {
                name: sanitized.name,
                slug: sanitized.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                description: sanitized.description || "",
                fields: body.fields || [],
                formula: body.formula,
                resultLabel: sanitized.resultLabel || "Estimated Result",
                resultUnit: sanitized.resultUnit || "₹",
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(calculator, { status: 201 });
    } catch {
        return apiError("Failed to create calculator");
    }
}

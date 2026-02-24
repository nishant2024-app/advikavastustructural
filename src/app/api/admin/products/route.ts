import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const products = await prisma.product.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(products);
    } catch {
        return apiError("Failed to fetch products");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["name"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["name", "description", "originalPrice"]);
        const product = await prisma.product.create({
            data: {
                name: sanitized.name,
                slug: sanitized.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                description: sanitized.description || "",
                price: body.price || "",
                originalPrice: sanitized.originalPrice || null,
                imageUrl: body.imageUrl || "",
                category: body.category || "",
                area: body.area || "",
                floors: body.floors ? parseInt(body.floors.toString()) : null,
                direction: body.direction || null,
                width: body.width ? parseFloat(body.width.toString()) : null,
                depth: body.depth ? parseFloat(body.depth.toString()) : null,
                bhk: body.bhk || null,
                vastu: body.vastu || "Doesn't Matter",
                code: body.code || null,
                order: body.order ?? 0,
                isVisible: body.isVisible ?? true,
            },
        });
        return NextResponse.json(product, { status: 201 });
    } catch {
        return apiError("Failed to create product");
    }
}

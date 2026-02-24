import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFields, sanitizeObject, apiError, checkRateLimit, getClientIp } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;
        const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(submissions);
    } catch {
        return apiError("Failed to fetch submissions");
    }
}

// Public endpoint — rate limited
export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req);
        const { limited, errorResponse: rlErr } = checkRateLimit(`contact-${ip}`, 5, 60000);
        if (limited) return rlErr;

        const body = await req.json();
        const { valid, errorResponse: ve } = validateFields(body, ["name", "email", "message"]);
        if (!valid) return ve;
        const sanitized = sanitizeObject(body, ["name", "email", "phone", "subject", "message"]);
        const submission = await prisma.contactSubmission.create({
            data: {
                name: sanitized.name,
                email: sanitized.email,
                phone: sanitized.phone || "",
                subject: sanitized.subject || "",
                message: sanitized.message,
            },
        });
        return NextResponse.json(submission, { status: 201 });
    } catch {
        return apiError("Failed to submit contact form");
    }
}

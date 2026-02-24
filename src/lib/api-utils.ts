import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ─── Auth Helpers ──────────────────────────────────────
export async function requireAuth(): Promise<{ authorized: boolean; session: any; errorResponse?: NextResponse }> {
    const session = await auth();
    if (!session?.user) {
        return {
            authorized: false,
            session: null,
            errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }
    return { authorized: true, session };
}

// ─── Input Validation ──────────────────────────────────
export function validateFields(
    body: Record<string, any>,
    required: string[]
): { valid: boolean; errorResponse?: NextResponse } {
    const missing = required.filter((f) => !body[f] || (typeof body[f] === "string" && body[f].trim() === ""));
    if (missing.length > 0) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { error: `Missing required fields: ${missing.join(", ")}` },
                { status: 400 }
            ),
        };
    }
    return { valid: true };
}

// ─── Sanitize ──────────────────────────────────────────
export function sanitize(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

export function sanitizeObject<T extends Record<string, any>>(obj: T, fields: string[]): T {
    const sanitized = { ...obj };
    for (const field of fields) {
        if (typeof sanitized[field] === "string") {
            (sanitized as any)[field] = sanitize(sanitized[field]);
        }
    }
    return sanitized;
}

// ─── Error Response ────────────────────────────────────
export function apiError(message: string, status: number = 500) {
    return NextResponse.json({ error: message }, { status });
}

// ─── Rate Limiting ─────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): { limited: boolean; errorResponse?: NextResponse } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
        return { limited: false };
    }

    entry.count++;
    if (entry.count > maxRequests) {
        return {
            limited: true,
            errorResponse: NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            ),
        };
    }

    return { limited: false };
}

// ─── Client IP Helper ──────────────────────────────────
export function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

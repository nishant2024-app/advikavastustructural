import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiError, checkRateLimit, getClientIp } from "@/lib/api-utils";

// ─── Chat API — Session & Message Storage ─────────────
// AI responses are handled client-side via Puter.js (free, no API key)
// This API only manages session creation and message persistence

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req);
        const { limited, errorResponse } = checkRateLimit(`chat-${ip}`, 30, 600000);
        if (limited) return errorResponse;

        const body = await req.json();
        const { action, sessionId, role, content, guestName, phone } = body;

        // ─── Create Session ───────────────────────────
        if (action === "create-session") {
            const session = await prisma.chatSession.create({
                data: {
                    ipAddress: ip,
                    guestName: guestName || null,
                    phone: phone || null,
                },
            });
            return NextResponse.json({ sessionId: session.id });
        }

        // ─── Store Message ────────────────────────────
        if (action === "store-message") {
            if (!sessionId || !role || !content) {
                return apiError("sessionId, role, and content are required", 400);
            }
            await prisma.chatMessage.create({
                data: { sessionId, role, content },
            });
            return NextResponse.json({ success: true });
        }

        // ─── Get History ──────────────────────────────
        if (action === "get-history") {
            if (!sessionId) return apiError("sessionId is required", 400);
            const messages = await prisma.chatMessage.findMany({
                where: { sessionId },
                orderBy: { createdAt: "asc" },
            });
            return NextResponse.json({ messages });
        }

        return apiError("Invalid action", 400);
    } catch {
        return apiError("Chat error");
    }
}

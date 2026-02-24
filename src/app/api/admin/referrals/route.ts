import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const referrers = await prisma.referrer.findMany({
            include: {
                _count: {
                    select: {
                        payments: {
                            where: { status: "PAID" }
                        }
                    }
                },
                payments: {
                    where: { status: "PAID" },
                    select: {
                        amount: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedReferrers = referrers.map((r: any) => ({
            id: r.id,
            name: r.name,
            phone: r.phone,
            referralCode: r.referralCode,
            successfulReferrals: r._count.payments,
            totalRevenue: r.payments.reduce((sum: number, p: any) => sum + p.amount, 0),
            createdAt: r.createdAt
        }));

        return NextResponse.json(formattedReferrers);
    } catch (error) {
        console.error("GET /api/admin/referrals error:", error);
        return apiError("Failed to fetch referral data");
    }
}

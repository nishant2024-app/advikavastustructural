import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-utils";

// GET — List all payments with optional filters
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const where: any = {};
        if (status && status !== "ALL") {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { userName: { contains: search, mode: "insensitive" } },
                { userEmail: { contains: search, mode: "insensitive" } },
                { userPhone: { contains: search, mode: "insensitive" } },
                { razorpayOrderId: { contains: search, mode: "insensitive" } },
                { razorpayPaymentId: { contains: search, mode: "insensitive" } },
            ];
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                referrer: { select: { name: true, phone: true, referralCode: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Summary stats
        const allPayments = await prisma.payment.findMany();
        const totalRevenue = allPayments
            .filter((p) => p.status === "PAID")
            .reduce((sum, p) => sum + p.amount, 0);
        const totalPaid = allPayments.filter((p) => p.status === "PAID").length;
        const totalPending = allPayments.filter((p) => p.status === "PENDING").length;
        const totalFailed = allPayments.filter((p) => p.status === "FAILED").length;

        return NextResponse.json({
            payments,
            stats: {
                totalRevenue,
                totalPaid,
                totalPending,
                totalFailed,
                total: allPayments.length,
            },
        });
    } catch (error: any) {
        console.error("Admin payments error:", error);
        return apiError("Failed to fetch payments");
    }
}

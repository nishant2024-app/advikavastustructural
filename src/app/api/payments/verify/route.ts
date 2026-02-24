import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = verifyPaymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid verification data" }, { status: 400 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validation.data;

        const signBody = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(signBody.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update payment in database (Using model Payment)
            await prisma.payment.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: "PAID",
                },
            });

            return NextResponse.json({ message: "Payment verified successfully" });
        } else {
            // Update payment as failed if signature doesn't match
            await prisma.payment.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    status: "FAILED",
                },
            });
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Razorpay Verification Error:", {
            message: error.message,
            stack: error.stack,
            error: error
        });
        // We still return 500 but log the detailed error
        return NextResponse.json({ error: "Verification failed internally" }, { status: 500 });
    }
}

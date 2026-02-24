import crypto from "crypto";

// Mocking the behavior of our verification route
function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");
    return expectedSignature === signature;
}

const testOrderId = "order_O8yYfQ0P9k2J5l";
const testPaymentId = "pay_O8yYfQ0P9k2J5l";
const testSecret = "test_secret";

const body = testOrderId + "|" + testPaymentId;
const testSignature = crypto
    .createHmac("sha256", testSecret)
    .update(body.toString())
    .digest("hex");

console.log("Testing Signature Verification...");
const isValid = verifySignature(testOrderId, testPaymentId, testSignature, testSecret);
console.log("Is Signature Valid?", isValid);

if (isValid) {
    console.log("✅ Signature verification logic is correct.");
} else {
    console.log("❌ Signature verification logic failed.");
    process.exit(1);
}

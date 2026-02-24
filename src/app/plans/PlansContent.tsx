"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Star, ChevronRight, Clock, MessageCircle, Loader2, ShoppingBag } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.15 } },
};

interface Plan {
    id: string; name: string; slug: string; description: string | null; price: string;
    features: any; timeline: string | null; isFeatured: boolean; order: number;
}

export default function PlansContent({ plans }: { plans: Plan[] }) {
    const { checkout, loading } = useRazorpay();

    // Checkout dialog state
    const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
    const [buyerName, setBuyerName] = useState("");
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handlePlanSelect = (plan: Plan) => {
        if (plan.price === "Contact Us") {
            window.location.href = "/contact";
            return;
        }
        setCheckoutPlan(plan);
        setBuyerName("");
        setBuyerEmail("");
        setBuyerPhone("");
        setCheckoutOpen(true);
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkoutPlan) return;
        setCheckoutOpen(false);
        await checkout({
            amount: checkoutPlan.price,
            planId: checkoutPlan.id,
            name: buyerName,
            email: buyerEmail,
            phone: buyerPhone,
            description: `Payment for ${checkoutPlan.name} Plan`,
        });
        setCheckoutPlan(null);
    };

    return (
        <>
            {/* Hero Banner */}
            <section className="sky-gradient text-white section-padding !pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                </div>
                <div className="container-wide relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Plans</h1>
                        <p className="text-white/70 text-lg">Choose the perfect architectural planning package for your project. All plans include professional drawings and dedicated support.</p>
                    </motion.div>
                </div>
            </section>

            {/* Plans Grid */}
            <section className="section-padding bg-white">
                <div className="container-wide">
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => {
                            const features = (plan.features as string[]) || [];
                            return (
                                <motion.div key={plan.id} variants={fadeInUp}>
                                    <Card className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 relative h-full ${plan.isFeatured ? "ring-2 ring-sky-primary shadow-lg scale-[1.02]" : ""}`}>
                                        {plan.isFeatured && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <Badge className="sky-gradient text-white border-0 px-4 py-1 font-semibold shadow-lg"><Star className="w-3 h-3 mr-1 fill-white" />Most Popular</Badge>
                                            </div>
                                        )}
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <h3 className="text-xl font-bold text-dark-blue">{plan.name}</h3>
                                            <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                                            <div className="my-4">
                                                <span className="text-3xl font-bold text-sky-primary">{plan.price}</span>
                                            </div>
                                            {plan.timeline && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                    <Clock className="w-4 h-4" /> {plan.timeline}
                                                </div>
                                            )}
                                            <ul className="space-y-2 mb-6 flex-1">
                                                {features.map((feature: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-sky-primary shrink-0 mt-0.5" />
                                                        <span className="text-muted-foreground">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                onClick={() => handlePlanSelect(plan)}
                                                disabled={loading}
                                                className={`w-full font-semibold ${plan.isFeatured ? "sky-gradient text-white" : "bg-section-gray text-dark-blue hover:bg-sky-light/30"}`}
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                {plan.price === "Contact Us" ? "Contact Us" : "Choose Plan"}
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding bg-section-gray">
                <div className="container-wide max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-dark-blue mb-8">Have Questions?</h2>
                    <p className="text-muted-foreground mb-8">Our team is here to help you choose the right plan. Contact us for a free consultation.</p>
                    <Button asChild size="lg" className="sky-gradient text-white font-semibold shadow-xl px-8">
                        <Link href="/contact"><MessageCircle className="w-4 h-4 mr-2" /> Contact Us</Link>
                    </Button>
                </div>
            </section>

            {/* Checkout Details Dialog */}
            <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden bg-white shadow-2xl border-0">
                    <div className="p-8">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-black text-dark-blue">Complete Your Purchase</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Please provide your details to proceed with the payment.
                            </DialogDescription>
                        </DialogHeader>

                        {checkoutPlan && (
                            <div className="bg-section-gray rounded-2xl p-4 mb-6">
                                <p className="font-bold text-dark-blue text-lg">{checkoutPlan.name}</p>
                                <p className="text-sm text-muted-foreground">{checkoutPlan.description}</p>
                                <p className="text-2xl font-black text-sky-primary mt-2">{checkoutPlan.price}</p>
                            </div>
                        )}

                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="plan-buyer-name" className="text-sm font-bold text-dark-blue">Full Name *</Label>
                                <Input
                                    id="plan-buyer-name"
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan-buyer-email" className="text-sm font-bold text-dark-blue">Email Address *</Label>
                                <Input
                                    id="plan-buyer-email"
                                    type="email"
                                    value={buyerEmail}
                                    onChange={(e) => setBuyerEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan-buyer-phone" className="text-sm font-bold text-dark-blue">Phone Number *</Label>
                                <Input
                                    id="plan-buyer-phone"
                                    type="tel"
                                    value={buyerPhone}
                                    onChange={(e) => setBuyerPhone(e.target.value)}
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl sky-gradient text-white font-bold text-base shadow-lg mt-4"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShoppingBag className="w-5 h-5 mr-2" />}
                                Proceed to Pay {checkoutPlan ? checkoutPlan.price : ""}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

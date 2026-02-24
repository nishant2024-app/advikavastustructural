"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    MessageCircle,
} from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.1 } },
};

const contactInfo = [
    {
        icon: Phone,
        title: "Phone",
        details: ["+91 98765 43210", "+91 98765 43211"],
        action: "tel:+919876543210",
    },
    {
        icon: Mail,
        title: "Email",
        details: ["info@advikavastu.in", "support@advikavastu.in"],
        action: "mailto:info@advikavastu.in",
    },
    {
        icon: MapPin,
        title: "Address",
        details: ["123 Business Tower, MG Road,", "Mumbai, Maharashtra 400001"],
        action: "#map",
    },
    {
        icon: Clock,
        title: "Working Hours",
        details: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: Closed"],
        action: null,
    },
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
            subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
        };
        try {
            await fetch("/api/admin/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            setSubmitted(true);
        } catch {
            alert("Failed to send message. Please try again.");
        }
        setLoading(false);
    };

    return (
        <>
            {/* Hero Banner */}
            <section className="sky-gradient text-white section-padding !pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                </div>
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-white/70 text-lg">
                            Get in touch with our team. We&apos;re here to help with your architectural and planning needs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section-padding bg-white">
                <div className="container-wide">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid lg:grid-cols-3 gap-10"
                    >
                        {/* Contact Info */}
                        <motion.div variants={fadeInUp} className="lg:col-span-1 space-y-6">
                            {contactInfo.map((info) => (
                                <Card key={info.title} className="border-0 shadow-sm bg-section-gray">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-xl sky-gradient flex items-center justify-center shrink-0 shadow-md shadow-sky-primary/20">
                                            <info.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-dark-blue mb-1">{info.title}</h4>
                                            {info.details.map((detail) => (
                                                <p key={detail} className="text-muted-foreground text-sm">{detail}</p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* WhatsApp CTA */}
                            <Button
                                asChild
                                className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold gap-2 py-6"
                            >
                                <a
                                    href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20your%20services"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Chat on WhatsApp
                                </a>
                            </Button>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div variants={fadeInUp} className="lg:col-span-2">
                            <Card className="border-0 shadow-md">
                                <CardContent className="p-6 md:p-8">
                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-sky-primary mx-auto mb-4" />
                                            <h3 className="text-2xl font-bold text-dark-blue mb-2">Thank You!</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
                                            </p>
                                            <Button
                                                onClick={() => setSubmitted(false)}
                                                className="sky-gradient text-white hover:opacity-90"
                                            >
                                                Send Another Message
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold text-dark-blue mb-6">Send us a Message</h3>
                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="grid sm:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Full Name *</Label>
                                                        <Input id="name" placeholder="Your name" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email *</Label>
                                                        <Input id="email" type="email" placeholder="your@email.com" required />
                                                    </div>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone</Label>
                                                        <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="subject">Subject</Label>
                                                        <Input id="subject" placeholder="Project inquiry" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="message">Message *</Label>
                                                    <Textarea
                                                        id="message"
                                                        placeholder="Tell us about your project..."
                                                        rows={5}
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full sky-gradient text-white hover:opacity-90 font-semibold py-6"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <Send className="w-4 h-4" />
                                                            Send Message
                                                        </span>
                                                    )}
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Google Map */}
            <section id="map" className="h-96 bg-section-gray">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1!2d72.8!3d19.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzEyLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Advika Vastu-Structural Location"
                />
            </section>
        </>
    );
}

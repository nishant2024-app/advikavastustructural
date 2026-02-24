"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { HomePageData } from "@/lib/types/home";

const quickLinks = [
    { href: "/services", label: "Services" },
    { href: "/plans", label: "Plans" },
    { href: "/products", label: "Products" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
];

const legalLinks = [
    { href: "/legal/terms-and-services", label: "Terms & Services" },
    { href: "/legal/privacy-policy", label: "Privacy Policy" },
    { href: "/legal/refund-policy", label: "Refund Policy" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
];

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer({ homeData }: { homeData?: HomePageData | null }) {
    const title = homeData?.headerTitle || "Advika Vastu Structural";
    const tagline = homeData?.headerSubtitle || "SAAS Solutions";
    const email = homeData?.contactEmail || "admin@vastustructural.com";
    const phone = homeData?.contactPhone || "+91 90679 69756";
    const address = homeData?.address || "Servicing All of India";

    const dynamicQuickLinks = homeData?.quickLinks && homeData.quickLinks.length > 0 ? homeData.quickLinks : quickLinks;
    const dynamicLegalLinks = homeData?.legalLinks && homeData.legalLinks.length > 0 ? homeData.legalLinks : legalLinks;
    const dynamicSocialLinks = homeData?.socialLinks && homeData.socialLinks.length > 0
        ? homeData.socialLinks.map((s: any) => ({
            label: s.platform,
            href: s.url,
            icon: s.platform?.toLowerCase().includes("face") ? Facebook :
                s.platform?.toLowerCase().includes("insta") ? Instagram :
                    s.platform?.toLowerCase().includes("link") ? Linkedin :
                        s.platform?.toLowerCase().includes("you") ? Youtube : Mail
        }))
        : socialLinks;

    return (
        <footer className="brand-gradient text-white">
            <div className="container-wide section-padding pb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gold-accent/20 flex items-center justify-center">
                                <span className="text-gold-accent font-bold text-xl">A</span>
                            </div>
                            <div>
                                <span className="text-lg font-bold block leading-tight">{title}</span>
                                <span className="text-[10px] text-gold-accent font-medium tracking-wider uppercase">{tagline}</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">
                            Expert Vastu-compliant architectural planning, structural consultancy, and professional engineering services across India.
                        </p>
                        <div className="flex gap-2">
                            {dynamicSocialLinks.map((s: any) => (
                                <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold-accent/20 hover:text-gold-accent transition-all">
                                    <s.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gold-accent mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {dynamicQuickLinks.map((link: any) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-gold-accent transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-gold-accent mb-4 text-sm tracking-wider uppercase">Legal</h4>
                        <ul className="space-y-2.5">
                            {dynamicLegalLinks.map((link: any) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-gold-accent transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-gold-accent mb-4 text-sm tracking-wider uppercase">Contact Us</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-start gap-2 text-sm text-white/60 hover:text-gold-accent transition-colors">
                                    <Phone className="w-4 h-4 mt-0.5 shrink-0" /> {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`} className="flex items-start gap-2 text-sm text-white/60 hover:text-gold-accent transition-colors">
                                    <Mail className="w-4 h-4 mt-0.5 shrink-0" /> {email}
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-white/60">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {address}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/50">
                        {homeData?.footerContent ? (
                            homeData.footerContent.replace("{year}", new Date().getFullYear().toString())
                        ) : (
                            <>&copy; {new Date().getFullYear()} Advika Vastu-Structural. All rights reserved.</>
                        )}
                    </p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-1 text-sm text-white/40 hover:text-gold-accent transition-colors">
                        Back to top <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function WelcomePopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem("advika-popup-shown");
        if (!alreadyShown) {
            const timer = setTimeout(() => setShow(true), 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const close = () => {
        setShow(false);
        sessionStorage.setItem("advika-popup-shown", "true");
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                            {/* Header */}
                            <div className="brand-gradient p-6 text-center relative">
                                <button onClick={close} className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-14 h-14 rounded-2xl bg-gold-accent/20 flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-7 h-7 text-gold-accent" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">Welcome to</h2>
                                <h3 className="text-xl font-bold text-gold-accent">Advika Vastu-Structural</h3>
                                <p className="text-white/60 text-sm mt-1">AI-Powered Platform</p>
                            </div>

                            {/* Body */}
                            <div className="p-6 text-center">
                                <p className="text-muted-foreground mb-6 text-sm">
                                    Get instant AI-driven Vastu reports, smart architectural planning, and expert structural consultancy across India-all in one place.
                                </p>
                                <Link
                                    href="/vastuscore"
                                    onClick={close}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-navy-primary font-semibold hover:opacity-90 transition-all shadow-md text-sm"
                                >
                                    Get Free AI Vastu Score <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

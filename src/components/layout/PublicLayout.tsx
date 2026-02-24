"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import { HomePageData } from "@/lib/types/home";

import Cookies from "js-cookie";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");
    const [homeData, setHomeData] = useState<HomePageData | null>(null);

    useEffect(() => {
        // Handle referral tracking
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");
        if (ref) {
            // Store in both localStorage and Cookies for maximum persistence
            localStorage.setItem("referralCode", ref);
            Cookies.set("referralCode", ref, { expires: 30 }); // 30 days
            console.log("Referral code captured:", ref);
        }

        if (!isAdmin) {
            fetch("/api/home")
                .then(res => res.json())
                .then(data => setHomeData(data))
                .catch(err => console.error("Failed to fetch home data", err));
        }
    }, [isAdmin]);

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header homeData={homeData} />
            <main className="min-h-screen">{children}</main>
            <Footer homeData={homeData} />
            <WelcomePopup />
        </>
    );
}

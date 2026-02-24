"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAboutPage() {
    const router = useRouter();
    useEffect(() => { router.replace("/admin/settings"); }, [router]);
    return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
            Redirecting to Settings...
        </div>
    );
}

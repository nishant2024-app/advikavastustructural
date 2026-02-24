"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Check } from "lucide-react";

interface LegalPage { id: string; title: string; slug: string; content: string; }

const TABS = [
    { slug: "terms-and-services", label: "Terms & Services" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "disclaimer", label: "Disclaimer" },
];

export default function AdminLegalPage() {
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [activeTab, setActiveTab] = useState("terms-and-services");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { fetchPages(); }, []);

    async function fetchPages() {
        setLoading(true);
        const res = await fetch("/api/admin/legal");
        setPages(await res.json());
        setLoading(false);
    }

    function updateContent(slug: string, content: string) {
        setPages((prev) =>
            prev.map((p) => (p.slug === slug ? { ...p, content } : p))
        );
        setSaved(false);
    }

    async function savePage() {
        const page = pages.find((p) => p.slug === activeTab);
        if (!page) return;
        setSaving(true);
        await fetch("/api/admin/legal", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: page.slug, title: page.title, content: page.content }),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    const activePage = pages.find((p) => p.slug === activeTab);

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-blue">Legal Pages</h1>
                    <p className="text-muted-foreground text-sm">Edit your legal page content (supports Markdown).</p>
                </div>
                <Button onClick={savePage} disabled={saving} className="sky-gradient text-white gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Saved!" : "Save"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => (
                    <Button key={tab.slug} variant={activeTab === tab.slug ? "default" : "outline"} size="sm"
                        className={activeTab === tab.slug ? "sky-gradient text-white" : ""} onClick={() => { setActiveTab(tab.slug); setSaved(false); }}>
                        {tab.label}
                    </Button>
                ))}
            </div>

            {activePage && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <Textarea
                            rows={20}
                            className="font-mono text-sm"
                            value={activePage.content}
                            onChange={(e) => updateContent(activePage.slug, e.target.value)}
                            placeholder="Enter content using Markdown format..."
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

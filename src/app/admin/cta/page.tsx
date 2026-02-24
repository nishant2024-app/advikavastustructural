"use client";

import { useState, useEffect } from "react";
import { Save, Megaphone, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CtaSection {
    id: string;
    headline: string;
    subtext: string | null;
    buttonText: string;
    buttonUrl: string;
    isVisible: boolean;
}

export default function AdminCTA() {
    const [cta, setCta] = useState<CtaSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/admin/cta")
            .then((r) => r.json())
            .then((data) => setCta(data[0] || { headline: "", subtext: "", buttonText: "", buttonUrl: "", isVisible: true }))
            .finally(() => setLoading(false));
    }, []);

    const saveCta = async () => {
        if (!cta) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/cta", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cta),
            });
            if (res.ok) alert("CTA Section updated successfully!");
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-navy-dark">CTA Section</h1>
                <p className="text-sm text-muted-foreground">Management high-conversion call-to-action on the home page.</p>
            </div>

            <Card className="border-navy-primary/10 shadow-lg">
                <CardHeader className="bg-cream-bg/50 border-b">
                    <CardTitle className="text-lg flex items-center gap-2 text-navy-primary"><Megaphone className="w-5 h-5 text-gold-accent" /> Headline & Content</CardTitle>
                    <CardDescription>This section appears above the footer on the home page.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Main Headline</Label>
                        <Input value={cta?.headline} onChange={(e) => setCta({ ...cta!, headline: e.target.value })} placeholder="e.g. Ready to Transform Your Space?" />
                    </div>

                    <div className="space-y-2">
                        <Label>Subtext / Supporting Text</Label>
                        <Textarea value={cta?.subtext || ""} onChange={(e) => setCta({ ...cta!, subtext: e.target.value })} placeholder="Provide context or a secondary hook..." rows={4} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Button Label</Label>
                            <Input value={cta?.buttonText} onChange={(e) => setCta({ ...cta!, buttonText: e.target.value })} placeholder="e.g. Get a Free Estimate" />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Link (URL)</Label>
                            <Input value={cta?.buttonUrl} onChange={(e) => setCta({ ...cta!, buttonUrl: e.target.value })} placeholder="/contact" />
                        </div>
                    </div>

                    <div className="pt-6 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isVisible" checked={cta?.isVisible} onChange={(e) => setCta({ ...cta!, isVisible: e.target.checked })} className="w-4 h-4 accent-gold-accent" />
                            <Label htmlFor="isVisible" className="cursor-pointer">Visible on website</Label>
                        </div>
                        <Button onClick={saveCta} disabled={saving} className="gold-gradient text-navy-primary font-bold px-8 shadow-md">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-white rounded-2xl p-6 border border-dashed border-gold-accent/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles className="w-12 h-12 text-gold-accent" /></div>
                <h3 className="font-bold text-navy-primary mb-2 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Live Preview Tip</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Once saved, the CTA section will immediately update on the home page. Use a clear, action-oriented headline and
                    ensure the button link points to a valid contact page or lead form.
                </p>
            </div>
        </div>
    );
}

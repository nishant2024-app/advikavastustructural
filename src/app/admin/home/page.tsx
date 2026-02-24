"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Globe, Layout, Search, Image as ImageIcon, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { HomePageData } from "@/lib/types/home";

export default function AdminHomePage() {
    const [data, setData] = useState<HomePageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("seo");

    useEffect(() => {
        fetchHomeData();
    }, []);

    async function fetchHomeData() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/home");
            if (res.ok) {
                const homeData = await res.json();
                setData(homeData);
            } else {
                toast.error("Failed to fetch home page data");
            }
        } catch (error) {
            toast.error("An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!data) return;

        setSaving(true);
        try {
            const res = await fetch("/api/admin/home", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success("Home page updated successfully");
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.error || "Failed to update home page");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div className="text-center py-10">No data found</div>;

    const handleChange = (field: keyof HomePageData, value: any) => {
        setData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const addLink = (type: "socialLinks" | "quickLinks" | "legalLinks") => {
        if (type === "socialLinks") {
            handleChange(type, [...data.socialLinks, { platform: "", url: "" }]);
        } else {
            handleChange(type, [...(data[type] as any), { label: "", href: "" }]);
        }
    };

    const removeLink = (type: "socialLinks" | "quickLinks" | "legalLinks", index: number) => {
        const newList = [...(data[type] as any)];
        newList.splice(index, 1);
        handleChange(type, newList);
    };

    const updateLink = (type: "socialLinks" | "quickLinks" | "legalLinks", index: number, field: string, value: string) => {
        const newList = [...(data[type] as any)];
        newList[index] = { ...newList[index], [field]: value };
        handleChange(type, newList);
    };

    const tabs = [
        { id: "seo", label: "SEO & Meta", icon: Search },
        { id: "header", label: "Header Config", icon: Layout },
        { id: "footer", label: "Footer Config", icon: Globe },
        { id: "hero", label: "Hero Content", icon: Layout },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-blue">Home Page Manager</h1>
                    <p className="text-muted-foreground text-sm">Comprehensive management for all public site content.</p>
                </div>
                <Button onClick={handleSubmit} disabled={saving} className="sky-gradient text-white gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Changes
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        onClick={() => setActiveTab(tab.id)}
                        className="shrink-0 gap-2"
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </Button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "seo" && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg font-bold">SEO & Meta Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="seoTitle">Page Title (Browser Tab)</Label>
                                <Input id="seoTitle" value={data.seoTitle || ""} onChange={e => handleChange("seoTitle", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seoDescription">Meta Description</Label>
                                <Textarea id="seoDescription" rows={3} value={data.seoDescription || ""} onChange={e => handleChange("seoDescription", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seoKeywords">Meta Keywords</Label>
                                <Input id="seoKeywords" value={data.seoKeywords || ""} onChange={e => handleChange("seoKeywords", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ogImage">OG Image URL</Label>
                                <Input id="ogImage" value={data.ogImage || ""} onChange={e => handleChange("ogImage", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "header" && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg font-bold">Header Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headerTitle">Logo Text</Label>
                                    <Input id="headerTitle" value={data.headerTitle || ""} onChange={e => handleChange("headerTitle", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="headerSubtitle">Header Tagline</Label>
                                    <Input id="headerSubtitle" value={data.headerSubtitle || ""} onChange={e => handleChange("headerSubtitle", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Public Email</Label>
                                    <Input id="contactEmail" value={data.contactEmail || ""} onChange={e => handleChange("contactEmail", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Public Phone</Label>
                                    <Input id="contactPhone" value={data.contactPhone || ""} onChange={e => handleChange("contactPhone", e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "footer" && (
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Quick Links</CardTitle>
                                <Button type="button" size="sm" onClick={() => addLink("quickLinks")}>Add Link</Button>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {data.quickLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input placeholder="Label" value={link.label} onChange={e => updateLink("quickLinks", i, "label", e.target.value)} />
                                        <Input placeholder="URL/Path" value={link.href} onChange={e => updateLink("quickLinks", i, "href", e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeLink("quickLinks", i)}>&times;</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Social Media</CardTitle>
                                <Button type="button" size="sm" onClick={() => addLink("socialLinks")}>Add Profile</Button>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {data.socialLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input placeholder="Platform" value={link.platform} onChange={e => updateLink("socialLinks", i, "platform", e.target.value)} />
                                        <Input placeholder="Full URL" value={link.url} onChange={e => updateLink("socialLinks", i, "url", e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeLink("socialLinks", i)}>&times;</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Legal Links</CardTitle>
                                <Button type="button" size="sm" onClick={() => addLink("legalLinks")}>Add Link</Button>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {data.legalLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input placeholder="Label" value={link.label} onChange={e => updateLink("legalLinks", i, "label", e.target.value)} />
                                        <Input placeholder="URL/Path" value={link.href} onChange={e => updateLink("legalLinks", i, "href", e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeLink("legalLinks", i)}>&times;</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-lg font-bold">Footer Text</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="footerContent">Copyright / Footer Note</Label>
                                    <Input id="footerContent" value={data.footerContent || ""} onChange={e => handleChange("footerContent", e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "hero" && (
                    <>
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-lg font-bold">Main Home Content (Hero Section)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="heroTitle">Hero Title</Label>
                                    <Input id="heroTitle" value={data.heroTitle || ""} onChange={e => handleChange("heroTitle", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="heroDescription">Hero Description</Label>
                                    <Textarea id="heroDescription" rows={3} value={data.heroDescription || ""} onChange={e => handleChange("heroDescription", e.target.value)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="heroButtonText">Button Text</Label>
                                        <Input id="heroButtonText" value={data.heroButtonText || ""} onChange={e => handleChange("heroButtonText", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="heroButtonLink">Button Link</Label>
                                        <Input id="heroButtonLink" value={data.heroButtonLink || ""} onChange={e => handleChange("heroButtonLink", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                        <Input id="whatsappNumber" value={data.whatsappNumber || ""} onChange={e => handleChange("whatsappNumber", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Bottom Location Info</Label>
                                        <Input id="address" value={data.address || ""} onChange={e => handleChange("address", e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm border-l-4 border-gold-accent bg-gold-accent/5">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gold-accent/20 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-gold-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-blue">Services Section</h3>
                                        <p className="text-sm text-muted-foreground">Manage the 6 service cards displayed on the home page.</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" className="border-gold-accent/30 hover:bg-gold-accent/5">
                                    <Link href="/admin/services">Manage Services <Globe className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving} className="sky-gradient text-white px-10 h-11 font-semibold">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        Save All Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}

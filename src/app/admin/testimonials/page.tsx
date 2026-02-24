"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Loader2 } from "lucide-react";

interface Testimonial {
    id: string; name: string; role: string; company: string; content: string;
    rating: number; order: number; isVisible: boolean;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

    useEffect(() => { fetchTestimonials(); }, []);

    async function fetchTestimonials() {
        setLoading(true);
        const res = await fetch("/api/admin/testimonials");
        setTestimonials(await res.json());
        setLoading(false);
    }

    async function addTestimonial() {
        setSaving(true);
        await fetch("/api/admin/testimonials", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Client", content: "Great service!", rating: 5, order: testimonials.length }),
        });
        await fetchTestimonials(); setSaving(false);
    }

    async function updateTestimonial(id: string, data: Partial<Testimonial>) {
        setSaving(true);
        await fetch(`/api/admin/testimonials/${id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        await fetchTestimonials(); setSaving(false); setEditingId(null);
    }

    async function deleteTestimonial(id: string) {
        if (!confirm("Delete this testimonial?")) return;
        await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
        await fetchTestimonials();
    }

    function openEdit(t: Testimonial) { setEditForm(t); setEditingId(t.id); }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-blue">Testimonials Manager</h1>
                    <p className="text-muted-foreground text-sm">Manage client reviews and testimonials.</p>
                </div>
                <Button onClick={addTestimonial} disabled={saving} className="sky-gradient text-white gap-2"><Plus className="w-4 h-4" /> Add Testimonial</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                    <Card key={t.id} className={`border-0 shadow-sm ${!t.isVisible ? "opacity-60" : ""}`}>
                        <CardContent className="p-5">
                            <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground italic line-clamp-3">&ldquo;{t.content}&rdquo;</p>
                            <div className="mt-3 pt-3 border-t">
                                <p className="font-semibold text-dark-blue text-sm">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                            </div>
                            <div className="flex gap-1 mt-3">
                                <Button variant="ghost" size="icon" onClick={() => updateTestimonial(t.id, { isVisible: !t.isVisible })}>
                                    {t.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Dialog open={editingId === t.id} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
                                    <DialogTrigger asChild><Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Edit className="w-4 h-4" /></Button></DialogTrigger>
                                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                                        <DialogHeader><DialogTitle>Edit Testimonial</DialogTitle></DialogHeader>
                                        <div className="space-y-4 mt-4">
                                            <div><Label>Name</Label><Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div><Label>Role</Label><Input value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} /></div>
                                            <div><Label>Company / Location</Label><Input value={editForm.company || ""} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} /></div>
                                            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={editForm.rating ?? 5} onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) || 5 })} /></div>
                                            <div><Label>Content</Label><Textarea rows={4} value={editForm.content || ""} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} /></div>
                                            <Button className="w-full sky-gradient text-white" disabled={saving} onClick={() => updateTestimonial(t.id, editForm)}>
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteTestimonial(t.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {testimonials.length === 0 && <p className="text-center text-muted-foreground py-8">No testimonials yet.</p>}
        </div>
    );
}

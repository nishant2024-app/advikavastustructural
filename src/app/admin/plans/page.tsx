"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Loader2 } from "lucide-react";

interface Plan {
    id: string; name: string; slug: string; description: string; price: string;
    features: string[]; timeline: string; isFeatured: boolean; order: number; isVisible: boolean;
}

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Plan>>({});

    useEffect(() => { fetchPlans(); }, []);

    async function fetchPlans() {
        setLoading(true);
        const res = await fetch("/api/admin/plans");
        setPlans(await res.json());
        setLoading(false);
    }

    async function addPlan() {
        setSaving(true);
        await fetch("/api/admin/plans", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Plan", price: "₹0", features: ["Feature 1"], order: plans.length }),
        });
        await fetchPlans(); setSaving(false);
    }

    async function updatePlan(id: string, data: Partial<Plan>) {
        setSaving(true);
        await fetch(`/api/admin/plans/${id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        await fetchPlans(); setSaving(false); setEditingId(null);
    }

    async function deletePlan(id: string) {
        if (!confirm("Delete this plan?")) return;
        await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
        await fetchPlans();
    }

    function openEdit(plan: Plan) { setEditForm(plan); setEditingId(plan.id); }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-blue">Plans Manager</h1>
                    <p className="text-muted-foreground text-sm">Manage your pricing plans and packages.</p>
                </div>
                <Button onClick={addPlan} disabled={saving} className="sky-gradient text-white gap-2"><Plus className="w-4 h-4" /> Add Plan</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`border-0 shadow-sm relative ${!plan.isVisible ? "opacity-60" : ""} ${plan.isFeatured ? "ring-2 ring-sky-primary" : ""}`}>
                        {plan.isFeatured && <div className="absolute -top-2 -right-2 w-8 h-8 sky-gradient rounded-full flex items-center justify-center"><Star className="w-4 h-4 text-white fill-white" /></div>}
                        <CardContent className="p-5">
                            <h3 className="font-bold text-dark-blue text-lg">{plan.name}</h3>
                            <p className="text-2xl font-bold text-sky-primary my-2">{plan.price}</p>
                            <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                            <ul className="space-y-1 mb-4 text-sm">
                                {(plan.features as string[] || []).slice(0, 4).map((f, i) => (
                                    <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-primary" />{f}</li>
                                ))}
                                {(plan.features as string[] || []).length > 4 && <li className="text-muted-foreground">+{(plan.features as string[]).length - 4} more...</li>}
                            </ul>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => updatePlan(plan.id, { isFeatured: !plan.isFeatured })}>
                                    <Star className={`w-4 h-4 ${plan.isFeatured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => updatePlan(plan.id, { isVisible: !plan.isVisible })}>
                                    {plan.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Dialog open={editingId === plan.id} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
                                    <DialogTrigger asChild><Button variant="ghost" size="icon" onClick={() => openEdit(plan)}><Edit className="w-4 h-4" /></Button></DialogTrigger>
                                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                                        <DialogHeader><DialogTitle>Edit Plan</DialogTitle></DialogHeader>
                                        <div className="space-y-4 mt-4">
                                            <div><Label>Name</Label><Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div><Label>Price</Label><Input value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></div>
                                            <div><Label>Description</Label><Textarea rows={2} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></div>
                                            <div><Label>Timeline</Label><Input value={editForm.timeline || ""} onChange={(e) => setEditForm({ ...editForm, timeline: e.target.value })} /></div>
                                            <div><Label>Features (one per line)</Label><Textarea rows={6} value={(editForm.features || []).join("\n")} onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split("\n").filter(Boolean) })} /></div>
                                            <Button className="w-full sky-gradient text-white" disabled={saving} onClick={() => updatePlan(plan.id, editForm)}>
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deletePlan(plan.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {plans.length === 0 && <p className="text-center text-muted-foreground py-8">No plans yet. Click &quot;Add Plan&quot; to create one.</p>}
        </div>
    );
}

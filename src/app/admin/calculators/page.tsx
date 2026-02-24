"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Calculator, Settings2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CalculatorField {
    name: string;
    label: string;
    type: string;
    defaultValue: number;
    unit?: string;
}

interface Calculator {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    fields: CalculatorField[];
    formula: string;
    resultLabel: string;
    resultUnit: string;
    isVisible: boolean;
}

export default function AdminCalculators() {
    const [calculators, setCalculators] = useState<Calculator[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editCalc, setEditCalc] = useState<Calculator | null>(null);

    useEffect(() => {
        fetch("/api/admin/calculators")
            .then((r) => r.json())
            .then(setCalculators)
            .finally(() => setLoading(false));
    }, []);

    const saveCalculator = async (calc: Calculator) => {
        setSaving(true);
        try {
            const method = calc.id ? "PUT" : "POST";
            const url = calc.id ? `/api/admin/calculators/${calc.id}` : "/api/admin/calculators";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(calc),
            });
            if (res.ok) {
                const updated = await res.json();
                if (method === "POST") setCalculators([...calculators, updated]);
                else setCalculators(calculators.map((c) => (c.id === updated.id ? updated : c)));
                setEditCalc(null);
            }
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const deleteCalculator = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/calculators/${id}`, { method: "DELETE" });
            if (res.ok) setCalculators(calculators.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const addField = () => {
        if (!editCalc) return;
        const newField: CalculatorField = { name: `field_${Date.now()}`, label: "New Field", type: "number", defaultValue: 0 };
        setEditCalc({ ...editCalc, fields: [...editCalc.fields, newField] });
    };

    const removeField = (index: number) => {
        if (!editCalc) return;
        const newFields = [...editCalc.fields];
        newFields.splice(index, 1);
        setEditCalc({ ...editCalc, fields: newFields });
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy-dark">Calculators</h1>
                    <p className="text-sm text-muted-foreground">Manage your site's interactive calculators and formulas.</p>
                </div>
                {!editCalc && (
                    <Button onClick={() => setEditCalc({ id: "", name: "New Calculator", slug: "", description: "", fields: [], formula: "", resultLabel: "Result", resultUnit: "", isVisible: true })} className="gold-gradient text-navy-primary font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add Calculator
                    </Button>
                )}
            </div>

            {editCalc ? (
                <Card className="border-navy-primary/10 shadow-lg">
                    <CardHeader className="border-b bg-cream-bg/50">
                        <CardTitle className="text-lg">Edit Calculator: {editCalc.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={editCalc.name} onChange={(e) => setEditCalc({ ...editCalc, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (Internal ID)</Label>
                                <Input value={editCalc.slug} onChange={(e) => setEditCalc({ ...editCalc, slug: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={editCalc.description || ""} onChange={(e) => setEditCalc({ ...editCalc, description: e.target.value })} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-bold">Input Fields</Label>
                                <Button size="sm" variant="outline" onClick={addField}><Plus className="w-4 h-4 mr-1" /> Add Field</Button>
                            </div>
                            <div className="space-y-3">
                                {editCalc.fields.map((field, idx) => (
                                    <div key={idx} className="flex gap-3 items-end bg-cream-bg/30 p-3 rounded-xl border border-dotted border-gold-accent/40">
                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase text-muted-foreground">Label</Label>
                                                <Input value={field.label} onChange={(e) => {
                                                    const f = [...editCalc.fields];
                                                    f[idx].label = e.target.value;
                                                    setEditCalc({ ...editCalc, fields: f });
                                                }} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase text-muted-foreground">Variable (ID)</Label>
                                                <Input value={field.name} onChange={(e) => {
                                                    const f = [...editCalc.fields];
                                                    f[idx].name = e.target.value;
                                                    setEditCalc({ ...editCalc, fields: f });
                                                }} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase text-muted-foreground">Default</Label>
                                                <Input type="number" value={field.defaultValue} onChange={(e) => {
                                                    const f = [...editCalc.fields];
                                                    f[idx].defaultValue = parseFloat(e.target.value);
                                                    setEditCalc({ ...editCalc, fields: f });
                                                }} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase text-muted-foreground">Unit</Label>
                                                <Input value={field.unit || ""} onChange={(e) => {
                                                    const f = [...editCalc.fields];
                                                    f[idx].unit = e.target.value;
                                                    setEditCalc({ ...editCalc, fields: f });
                                                }} />
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeField(idx)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <Label className="text-base font-bold">Formula & Result</Label>
                            <div className="grid md:grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>JavaScript Formula (Example: width * height * 10.5)</Label>
                                    <Input value={editCalc.formula} onChange={(e) => setEditCalc({ ...editCalc, formula: e.target.value })} className="font-mono bg-navy-dark text-gold-accent" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Result Label</Label>
                                    <Input value={editCalc.resultLabel} onChange={(e) => setEditCalc({ ...editCalc, resultLabel: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Result Unit</Label>
                                    <Input value={editCalc.resultUnit} onChange={(e) => setEditCalc({ ...editCalc, resultUnit: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-6">
                            <Button variant="ghost" onClick={() => setEditCalc(null)}>Cancel</Button>
                            <Button onClick={() => saveCalculator(editCalc)} disabled={saving} className="gold-gradient text-navy-primary font-bold">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {calculators.map((calc) => (
                        <Card key={calc.id} className="hover:border-gold-accent/50 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-gold-accent" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-navy-dark">{calc.name}</h3>
                                    <p className="text-xs text-muted-foreground">{calc.fields.length} inputs • Formula: {calc.formula}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditCalc(calc)}><Settings2 className="w-4 h-4 mr-2" /> Edit</Button>
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteCalculator(calc.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {calculators.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-muted-foreground">
                            No calculators yet. Click "Add Calculator" to get started.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Mail, MailOpen, Loader2 } from "lucide-react";

interface Submission {
    id: string; name: string; email: string; phone: string; subject: string;
    message: string; isRead: boolean; createdAt: string;
}

export default function AdminContactPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        const res = await fetch("/api/admin/contact");
        setSubmissions(await res.json());
        setLoading(false);
    }

    async function toggle(id: string, isRead: boolean) {
        await fetch(`/api/admin/contact/${id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: !isRead }),
        });
        await fetchData();
    }

    async function remove(id: string) {
        if (!confirm("Delete this submission?")) return;
        await fetch(`/api/admin/contact/${id}`, { method: "DELETE" });
        await fetchData();
    }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-primary" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-dark-blue">Contact Submissions</h1>
                <p className="text-muted-foreground text-sm">{submissions.filter((s) => !s.isRead).length} unread of {submissions.length} total</p>
            </div>

            <div className="space-y-3">
                {submissions.map((s) => (
                    <Card key={s.id} className={`border-0 shadow-sm ${!s.isRead ? "border-l-4 border-l-sky-primary" : ""}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-dark-blue">{s.name}</h3>
                                        {!s.isRead && <span className="text-xs px-2 py-0.5 rounded-full bg-sky-primary text-white">New</span>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{s.email} {s.phone ? `• ${s.phone}` : ""}</p>
                                    {s.subject && <p className="text-sm font-medium mt-1">{s.subject}</p>}
                                    <p className="text-sm text-muted-foreground mt-1">{s.message}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(s.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-1 ml-4">
                                    <Button variant="ghost" size="icon" onClick={() => toggle(s.id, s.isRead)}>
                                        {s.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {submissions.length === 0 && <p className="text-center text-muted-foreground py-8">No contact submissions yet.</p>}
            </div>
        </div>
    );
}

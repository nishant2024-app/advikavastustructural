"use client";

import { useState, useEffect } from "react";
import { MessageCircle, User, Bot, Calendar, Phone, Mail, Loader2, ArrowRight, MessageSquareDashed, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    createdAt: string;
}

interface ChatSession {
    id: string;
    guestName: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    messages: Message[];
}

export default function AdminChatbotLogs() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = () => {
        setLoading(true);
        fetch("/api/admin/chatbot")
            .then((r) => r.json())
            .then(setSessions)
            .finally(() => setLoading(false));
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this chat session?")) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/chatbot?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Chat session deleted");
                setSessions(sessions.filter(s => s.id !== id));
                if (selectedSession === id) setSelectedSession(null);
            } else {
                toast.error("Failed to delete chat session");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setDeleting(null);
        }
    };

    const selectedData = sessions.find((s) => s.id === selectedSession);

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-gold-accent" /></div>;

    return (
        <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-navy-dark">Little Adu Chat Logs</h1>
                <p className="text-sm text-muted-foreground">Review conversations from your AI assistant and leads.</p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Session List */}
                <div className="w-80 bg-white border border-navy-primary/5 rounded-2xl overflow-y-auto shadow-sm">
                    <div className="p-4 border-b bg-cream-bg/20 font-bold text-navy-primary text-sm uppercase tracking-wider">Recent Sessions</div>
                    {sessions.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedSession(s.id)}
                            className={`w-full text-left p-4 border-b hover:bg-gold-accent/5 transition-colors group relative ${selectedSession === s.id ? "bg-gold-accent/10 border-l-4 border-l-gold-accent" : "border-navy-primary/5"}`}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-navy-primary/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-navy-primary" />
                                </div>
                                <span className="font-bold text-sm text-navy-dark truncate flex-1">{s.guestName || "Guest User"}</span>
                                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(s.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between ml-11">
                                <p className="text-xs text-muted-foreground truncate flex-1">
                                    {s.messages[s.messages.length - 1]?.content || "No messages"}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDelete(e, s.id)}
                                    disabled={deleting === s.id}
                                    className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                >
                                    {deleting === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </Button>
                            </div>
                        </button>
                    ))}
                    {sessions.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground">
                            <MessageSquareDashed className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm italic">No chat history yet.</p>
                        </div>
                    )}
                </div>

                {/* Chat Detail */}
                <div className="flex-1 bg-white border border-navy-primary/5 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    {selectedData ? (
                        <>
                            <div className="p-4 border-b bg-navy-dark text-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gold-accent/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-gold-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{selectedData.guestName || "Anonymous Lead"}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            {selectedData.email && <span className="text-[10px] flex items-center gap-1 text-gold-accent/80"><Mail className="w-3 h-3" /> {selectedData.email}</span>}
                                            {selectedData.phone && <span className="text-[10px] flex items-center gap-1 text-gold-accent/80"><Phone className="w-3 h-3" /> {selectedData.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="border-gold-accent/30 text-gold-accent text-[10px] uppercase">{selectedData.messages.length} Messages</Badge>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream-bg/20">
                                {selectedData.messages.map((m) => (
                                    <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-navy-primary text-white rounded-tr-none" : "bg-white border border-navy-primary/10 text-navy-dark shadow-sm rounded-tl-none"}`}>
                                            <p>{m.content}</p>
                                            <span className={`text-[9px] block mt-1 opacity-50 ${m.role === "user" ? "text-right" : "text-left"}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-cream-bg flex items-center justify-center mb-4">
                                <ArrowRight className="w-8 h-8 text-gold-accent opacity-30" />
                            </div>
                            <h3 className="text-lg font-bold text-navy-primary mb-2">Select a Conversation</h3>
                            <p className="max-w-xs text-sm">Pick a chat session from the list to view lead info and conversation history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, CreditCard, PackageSearch, Image, MessageSquare, Star, FileText, MessageCircle, Settings, ChevronRight, BarChart3, Loader2, IndianRupee } from "lucide-react";

interface Stats {
    services: number;
    plans: number;
    products: number;
    gallery: number;
    testimonials: number;
    contacts: number;
    chatSessions: number;
    payments: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/dashboard")
            .then((r) => r.json())
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats
        ? [
            { label: "Services", value: stats.services, icon: Wrench, color: "bg-blue-500" },
            { label: "Plans", value: stats.plans, icon: CreditCard, color: "bg-emerald-500" },
            { label: "Products", value: stats.products, icon: PackageSearch, color: "bg-purple-500" },
            { label: "Gallery Items", value: stats.gallery, icon: Image, color: "bg-orange-500" },
            { label: "Testimonials", value: stats.testimonials, icon: Star, color: "bg-yellow-500" },
            { label: "Contact Messages", value: stats.contacts, icon: MessageSquare, color: "bg-rose-500" },
            { label: "Chat Sessions", value: stats.chatSessions, icon: MessageCircle, color: "bg-teal-500" },
            { label: "Payments", value: stats.payments, icon: IndianRupee, color: "bg-emerald-600" },
        ]
        : [];

    const quickActions = [
        { label: "Manage Services", href: "/admin/services", icon: Wrench },
        { label: "Manage Plans", href: "/admin/plans", icon: CreditCard },
        { label: "Manage Products", href: "/admin/products", icon: PackageSearch },
        { label: "Payments", href: "/admin/payments", icon: IndianRupee },
        { label: "Gallery", href: "/admin/gallery", icon: Image },
        { label: "Testimonials", href: "/admin/testimonials", icon: Star },
        { label: "Contact Submissions", href: "/admin/contact", icon: MessageSquare },
        { label: "Legal Pages", href: "/admin/legal", icon: FileText },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#C5A55A] flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Advika Vastu Structural Admin Panel</p>
                </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C5A55A]/30 transition-all group"
                        >
                            <action.icon className="w-5 h-5 text-gray-400 group-hover:text-[#C5A55A] transition-colors" />
                            <span className="text-sm font-medium text-gray-700 flex-1">{action.label}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C5A55A] transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

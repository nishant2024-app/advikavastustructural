"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: string; name: string; slug: string; description: string; price: string;
    originalPrice?: string; imageUrl?: string;
    category: string; area: string; order: number; isVisible: boolean;
    floors?: number; direction?: string; width?: number; depth?: number;
    bhk?: string; vastu?: string; code?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchProducts(); }, []);

    async function fetchProducts() {
        setLoading(true);
        const res = await fetch("/api/admin/products");
        setProducts(await res.json());
        setLoading(false);
    }

    async function addProduct() {
        setSaving(true);
        await fetch("/api/admin/products", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Product", price: "₹0", category: "Residential", order: products.length }),
        });
        await fetchProducts(); setSaving(false);
    }

    async function updateProduct(id: string, data: Partial<Product>) {
        setSaving(true);
        await fetch(`/api/admin/products/${id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        await fetchProducts(); setSaving(false); setEditingId(null);
    }

    async function deleteProduct(id: string) {
        if (!confirm("Delete this product?")) return;
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        await fetchProducts();
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "products");

            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upload failed");
            }
            const { url } = await res.json();
            setEditForm(prev => ({ ...prev, imageUrl: url }));
            toast.success("Image uploaded successfully");
        } catch (err: any) {
            toast.error(err.message || "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function openEdit(product: Product) { setEditForm(product); setEditingId(product.id); }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-blue">Products Manager</h1>
                    <p className="text-muted-foreground text-sm">Manage your ready-made design products and plans.</p>
                </div>
                <Button onClick={addProduct} disabled={saving} className="sky-gradient text-white gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <Card key={product.id} className={`border-0 shadow-sm overflow-hidden ${!product.isVisible ? "opacity-60" : ""}`}>
                        {/* Image Preview */}
                        <div className="h-40 bg-gradient-to-br from-sky-light/20 to-sky-primary/10 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <ImageIcon className="w-8 h-8 opacity-30" />
                                    <span className="text-xs opacity-50">No image</span>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-sky-light/20 text-sky-primary">{product.category || "General"}</span>
                                <span className="font-bold text-sky-primary">{product.price}</span>
                            </div>
                            <h3 className="font-bold text-dark-blue">{product.name}</h3>
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
                            {product.area && <p className="text-xs text-muted-foreground mt-2">Area: {product.area}</p>}
                            <div className="flex gap-1 mt-3 border-t pt-3">
                                <Button variant="ghost" size="icon" onClick={() => updateProduct(product.id, { isVisible: !product.isVisible })}>
                                    {product.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Dialog open={editingId === product.id} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
                                    <DialogTrigger asChild><Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Edit className="w-4 h-4" /></Button></DialogTrigger>
                                    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                                        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                                        <div className="space-y-4 mt-4">
                                            {/* Image Upload */}
                                            <div>
                                                <Label>Product Image</Label>
                                                <div className="mt-2">
                                                    {editForm.imageUrl ? (
                                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-gray-50">
                                                            <img src={editForm.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                                                onClick={() => setEditForm({ ...editForm, imageUrl: "" })}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                            {uploading ? (
                                                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                                                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                                                                    <span className="text-xs text-muted-foreground/60 mt-1">JPEG, PNG, WebP • Max 5MB</span>
                                                                </>
                                                            )}
                                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <div><Label>Name</Label><Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Offer Price (e.g. 3999)</Label><Input value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></div>
                                                <div><Label>Original Price (e.g. 5999)</Label><Input value={editForm.originalPrice || ""} onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Category</Label><Input value={editForm.category || ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} /></div>
                                                <div><Label>Area (sq.ft)</Label><Input value={editForm.area || ""} onChange={(e) => setEditForm({ ...editForm, area: e.target.value })} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>BHK</Label><Input placeholder="e.g. 3BHK" value={editForm.bhk || ""} onChange={(e) => setEditForm({ ...editForm, bhk: e.target.value })} /></div>
                                                <div><Label>Floors</Label><Input type="number" value={editForm.floors || ""} onChange={(e) => setEditForm({ ...editForm, floors: parseInt(e.target.value) || 0 })} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Width (ft)</Label><Input type="number" value={editForm.width || ""} onChange={(e) => setEditForm({ ...editForm, width: parseFloat(e.target.value) || 0 })} /></div>
                                                <div><Label>Depth (ft)</Label><Input type="number" value={editForm.depth || ""} onChange={(e) => setEditForm({ ...editForm, depth: parseFloat(e.target.value) || 0 })} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Direction</Label><Input placeholder="e.g. North-East" value={editForm.direction || ""} onChange={(e) => setEditForm({ ...editForm, direction: e.target.value })} /></div>
                                                <div><Label>Vastu</Label><Input placeholder="Yes/No/Doesn't Matter" value={editForm.vastu || ""} onChange={(e) => setEditForm({ ...editForm, vastu: e.target.value })} /></div>
                                            </div>
                                            <div><Label>Design Code</Label><Input placeholder="e.g. AD-101" value={editForm.code || ""} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} /></div>
                                            <div><Label>Description</Label><Textarea rows={3} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></div>
                                            <Button className="w-full sky-gradient text-white" disabled={saving} onClick={() => updateProduct(product.id, editForm)}>
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {products.length === 0 && <p className="text-center text-muted-foreground py-8">No products yet. Click &quot;Add Product&quot; to create one.</p>}
        </div>
    );
}

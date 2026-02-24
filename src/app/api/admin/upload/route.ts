import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-utils";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { nanoid } from "nanoid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
    try {
        const { authorized, errorResponse } = await requireAuth();
        if (!authorized) return errorResponse;

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "general";

        if (!file) {
            return apiError("No file provided", 400);
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return apiError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF", 400);
        }

        if (file.size > MAX_FILE_SIZE) {
            return apiError("File too large. Maximum size is 5MB", 400);
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${folder}/${nanoid(12)}.${ext}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return apiError("Upload failed: " + error.message, 500);
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: data.path,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return apiError("Upload failed", 500);
    }
}

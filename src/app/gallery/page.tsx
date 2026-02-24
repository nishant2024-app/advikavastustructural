import { getGalleryItems, getGalleryCategories } from "@/lib/data";
import GalleryContent from "./GalleryContent";

export default async function GalleryPage() {
    const [items, categories] = await Promise.all([
        getGalleryItems(),
        getGalleryCategories(),
    ]);
    return <GalleryContent items={items} categories={categories} />;
}

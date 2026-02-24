import { cache } from "react";
import { prisma } from "./prisma";
import { HomePageData, DEFAULT_HOME_DATA, NavLink, SocialLink } from "./types/home";

// ─── Error Handler ─────────────────────────────────────
/** Wraps a Prisma query with error handling, returning a fallback on failure. */
async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T, label: string): Promise<T> {
    try {
        return await queryFn();
    } catch (error) {
        console.error(`[Data] Failed to fetch ${label}:`, error instanceof Error ? error.message : error);
        return fallback;
    }
}

// ─── Services ──────────────────────────────────────────
/** Fetches all visible services ordered by display position. */
export async function getServices() {
    return safeQuery(
        () => prisma.service.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "services"
    );
}

/** Fetches all services (including hidden) for admin panel. */
export async function getAllServices() {
    return safeQuery(
        () => prisma.service.findMany({ orderBy: { order: "asc" } }),
        [],
        "all services"
    );
}

// ─── Plans ─────────────────────────────────────────────
/** Fetches all visible plans ordered by display position. */
export async function getPlans() {
    return safeQuery(
        () => prisma.plan.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "plans"
    );
}

/** Fetches all plans (including hidden) for admin panel. */
export async function getAllPlans() {
    return safeQuery(
        () => prisma.plan.findMany({ orderBy: { order: "asc" } }),
        [],
        "all plans"
    );
}

// ─── Products ──────────────────────────────────────────
/** Fetches all visible products ordered by display position. */
export async function getProducts() {
    return safeQuery(
        () => prisma.product.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "products"
    );
}

/** Fetches all products (including hidden) for admin panel. */
export async function getAllProducts() {
    return safeQuery(
        () => prisma.product.findMany({ orderBy: { order: "asc" } }),
        [],
        "all products"
    );
}

// ─── Gallery ───────────────────────────────────────────
/** Fetches gallery categories with their visible items. */
export async function getGalleryCategories() {
    return safeQuery(
        () => prisma.galleryCategory.findMany({
            include: { items: { where: { isVisible: true }, orderBy: { order: "asc" } } },
            orderBy: { order: "asc" },
        }),
        [],
        "gallery categories"
    );
}

/** Fetches all visible gallery items with their category. */
export async function getGalleryItems() {
    return safeQuery(
        () => prisma.galleryItem.findMany({
            where: { isVisible: true },
            include: { category: true },
            orderBy: { order: "asc" },
        }),
        [],
        "gallery items"
    );
}

/** Fetches all gallery items (including hidden) for admin panel. */
export async function getAllGalleryItems() {
    return safeQuery(
        () => prisma.galleryItem.findMany({
            include: { category: true },
            orderBy: { order: "asc" },
        }),
        [],
        "all gallery items"
    );
}

// ─── Testimonials ──────────────────────────────────────
/** Fetches all visible testimonials ordered by display position. */
export async function getTestimonials() {
    return safeQuery(
        () => prisma.testimonial.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "testimonials"
    );
}

/** Fetches all testimonials (including hidden) for admin panel. */
export async function getAllTestimonials() {
    return safeQuery(
        () => prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
        [],
        "all testimonials"
    );
}

// ─── Legal Pages ───────────────────────────────────────
/** Fetches a single legal page by its slug. */
export async function getLegalPage(slug: string): Promise<{ title: string; content: string; slug: string } | null> {
    return safeQuery(
        () => prisma.legalPage.findUnique({ where: { slug } }),
        null,
        `legal page: ${slug}`
    );
}

/** Fetches all legal pages for admin panel. */
export async function getAllLegalPages(): Promise<Array<{ id: string; title: string; slug: string; updatedAt: Date }>> {
    return safeQuery(
        () => prisma.legalPage.findMany(),
        [],
        "all legal pages"
    );
}

// ─── Contact Submissions ──────────────────────────────
/** Fetches all contact submissions, newest first. */
export async function getContactSubmissions() {
    return safeQuery(
        () => prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
        [],
        "contact submissions"
    );
}

// ─── Global Settings ──────────────────────────────────
/** Fetches all global settings as a key-value record. */
export async function getSettings(): Promise<Record<string, any>> {
    try {
        const rows = await prisma.globalSettings.findMany();
        const settings: Record<string, any> = {};
        for (const row of rows) {
            settings[row.key] = row.value;
        }
        return settings;
    } catch (error) {
        console.error("[Data] Failed to fetch settings:", error instanceof Error ? error.message : error);
        return {};
    }
}

/** Fetches a single setting value by key. */
export async function getSetting(key: string) {
    try {
        const row = await prisma.globalSettings.findUnique({ where: { key } });
        return row?.value ?? null;
    } catch (error) {
        console.error(`[Data] Failed to fetch setting "${key}":`, error instanceof Error ? error.message : error);
        return null;
    }
}

// ─── Calculators ──────────────────────────────────────
/** Fetches all visible calculators ordered by display position. */
export async function getCalculators() {
    return safeQuery(
        () => prisma.calculator.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "calculators"
    );
}

/** Fetches all calculators (including hidden) for admin panel. */
export async function getAllCalculators() {
    return safeQuery(
        () => prisma.calculator.findMany({ orderBy: { order: "asc" } }),
        [],
        "all calculators"
    );
}

// ─── CTA Sections ─────────────────────────────────────
/** Fetches all visible CTA sections ordered by display position. */
export async function getCtaSections() {
    return safeQuery(
        () => prisma.ctaSection.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        [],
        "CTA sections"
    );
}

/** Fetches all CTA sections (including hidden) for admin panel. */
export async function getAllCtaSections() {
    return safeQuery(
        () => prisma.ctaSection.findMany({ orderBy: { order: "asc" } }),
        [],
        "all CTA sections"
    );
}

// ─── Chat Sessions ────────────────────────────────────
/** Fetches recent chat sessions with messages, limited by count. */
export async function getChatSessions(limit: number = 50) {
    return safeQuery(
        () => prisma.chatSession.findMany({
            include: { messages: { orderBy: { createdAt: "asc" } } },
            orderBy: { createdAt: "desc" },
            take: limit,
        }),
        [],
        "chat sessions"
    );
}

/** Fetches a single chat session by ID with all its messages. */
export async function getChatSessionById(id: string) {
    return safeQuery(
        () => prisma.chatSession.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: "asc" } } },
        }),
        null,
        `chat session: ${id}`
    );
}

// ─── Dashboard Stats ──────────────────────────────────
/** Fetches aggregate counts for the admin dashboard. */
export async function getDashboardStats() {
    const defaultStats = { services: 0, plans: 0, products: 0, gallery: 0, testimonials: 0, contacts: 0, chatSessions: 0, payments: 0 };
    try {
        const [services, plans, products, gallery, testimonials, contacts, chatSessions, payments] =
            await Promise.all([
                prisma.service.count(),
                prisma.plan.count(),
                prisma.product.count(),
                prisma.galleryItem.count(),
                prisma.testimonial.count(),
                prisma.contactSubmission.count(),
                prisma.chatSession.count(),
                prisma.payment.count(),
            ]);
        return { services, plans, products, gallery, testimonials, contacts, chatSessions, payments };
    } catch (error) {
        console.error("[Data] Failed to fetch dashboard stats:", error instanceof Error ? error.message : error);
        return defaultStats;
    }
}

// ─── Home Page ────────────────────────────────────────
/** Fetches the singleton home page data, merging with defaults for missing fields. */
export const getHomePageData = cache(async (): Promise<HomePageData> => {
    try {
        const data = await (prisma as any).homePage.findUnique({
            where: { id: "singleton" },
        });

        return {
            ...DEFAULT_HOME_DATA,
            ...data,
            id: "singleton",
            socialLinks: (data?.socialLinks as SocialLink[]) || DEFAULT_HOME_DATA.socialLinks,
            quickLinks: (data?.quickLinks as NavLink[]) || DEFAULT_HOME_DATA.quickLinks,
            legalLinks: (data?.legalLinks as NavLink[]) || DEFAULT_HOME_DATA.legalLinks,
        } as HomePageData;
    } catch (error) {
        console.error("[Data] Failed to fetch home page data:", error instanceof Error ? error.message : error);
        return { ...DEFAULT_HOME_DATA, id: "singleton" } as HomePageData;
    }
});

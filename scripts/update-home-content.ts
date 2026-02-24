import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

async function main() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log("🚀 Updating Home Page and Services content...");

    try {
        // --- Update Home Page Hero ---
        await prisma.homePage.upsert({
            where: { id: "singleton" },
            update: {
                heroTitle: "Easiest Way to Design Beautiful Homes and Spaces",
                heroDescription: "House plan, 3D building elevation designs, and interior designing services at best rates. Get your home expertly designed fast easy and affordably.",
                heroButtonText: "Explore Designs",
                heroButtonLink: "/services",
            },
            create: {
                id: "singleton",
                heroTitle: "Easiest Way to Design Beautiful Homes and Spaces",
                heroDescription: "House plan, 3D building elevation designs, and interior designing services at best rates. Get your home expertly designed fast easy and affordably.",
                heroButtonText: "Explore Designs",
                heroButtonLink: "/services",
            },
        });
        console.log("  ✅ Hero section updated");

        // --- Update Services ---
        const services = [
            {
                title: "Readymade House Plan",
                slug: "readymade-house-plan",
                description: "Explore our handpicked collection of expertly designed house plans with front elevation designs, and get it customized perfectly to fit your requirement.",
                icon: "🏠",
                order: 0,
            },
            {
                title: "Customized House Design",
                slug: "customized-house-design",
                description: "Use our fully personalized and customized house designing services to get your home designed as per your plot size, space requirements and budget.",
                icon: "📐",
                order: 1,
            },
            {
                title: "3D Front Elevations",
                slug: "3d-front-elevations",
                description: "Already have a floor plan? Our expert architects and house designers can help design beautiful front and side elevation and views for your dream home.",
                icon: "🏗️",
                order: 2,
            },
            {
                title: "Floor Plans",
                slug: "floor-plans",
                description: "We design best space optimized floor plans that can help you visualize the layout of the floor, and size of the specific rooms and space for your dream home.",
                icon: "📋",
                order: 3,
            },
            {
                title: "Interior Design",
                slug: "interior-design",
                description: "If you're designing or renovate your house, shop, boutique, café etc, our online 3D interior designing services will help you get that premium look within your budget.",
                icon: "🛋️",
                order: 4,
            },
            {
                title: "Vastu Consultancy",
                slug: "vastu-consultancy-premium",
                description: "Building, renovating or decorating your home as per Vastu Shastra guideline is believed to bring positivity. Our Vastu experts can help you get it right.",
                icon: "🔮",
                order: 5,
            },
        ];

        for (const s of services) {
            await prisma.service.upsert({
                where: { slug: s.slug },
                update: s,
                create: s,
            });
        }
        console.log(`  ✅ ${services.length} services updated`);

        console.log("\n✨ Success: Content updated in the database!");
    } catch (error) {
        console.error("❌ Error updating content:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();

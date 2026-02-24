import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // --- Admin User ---
    const hashedPassword = await bcrypt.hash("admin@advika2025", 12);
    await prisma.adminUser.upsert({
        where: { email: "admin@advikavastu.in" },
        update: { password: hashedPassword },
        create: {
            email: "admin@advikavastu.in",
            password: hashedPassword,
            name: "Admin",
            role: "super_admin",
        },
    });
    console.log("  ✅ Admin user created (admin@advikavastu.in)");

    // --- Services ---
    const services = [
        { title: "Architectural Planning", slug: "architectural-planning", description: "Comprehensive architectural solutions for modern buildings and structures, combining aesthetics with functionality.", icon: "🏗️", processSteps: ["Consultation", "Site Analysis", "Design Development", "Drawing Preparation", "Approval Assistance", "Post-Delivery Support"], deliverables: ["Architectural Drawings", "3D Visualizations", "Material Specifications", "Cost Estimation"], order: 0 },
        { title: "Structural Consultancy", slug: "structural-consultancy", description: "Expert structural analysis and consultancy for safe, durable constructions with Vastu compliance.", icon: "🔧", processSteps: ["Structural Analysis", "Load Calculations", "Foundation Design", "RCC Detailing", "Review & Optimization"], deliverables: ["Structural Drawings", "RCC Details", "Foundation Plans", "Safety Report"], order: 1 },
        { title: "Vastu Consultancy", slug: "vastu-consultancy", description: "Traditional Vastu Shastra guidance integrated with modern architectural design for harmonious living.", icon: "🔮", processSteps: ["Vastu Analysis", "Direction Assessment", "Space Alignment", "Element Balancing", "Design Integration"], deliverables: ["Vastu Report", "Direction Map", "Remedial Suggestions", "Compliant Floor Plan"], order: 2 },
        { title: "Residential Planning", slug: "residential-planning", description: "Custom residential designs blending comfort with aesthetic excellence and Vastu principles.", icon: "🏠", processSteps: ["Requirements Gathering", "Space Planning", "Design Development", "Interior Layout", "Vastu Compliance", "Documentation"], deliverables: ["Floor Plans", "Elevation Designs", "Section Views", "Interior Layout"], order: 3 },
        { title: "Commercial Planning", slug: "commercial-planning", description: "Strategic commercial space planning for maximum efficiency and productivity.", icon: "🏢", processSteps: ["Business Analysis", "Space Optimization", "Workflow Planning", "Design Iteration", "Compliance Check"], deliverables: ["Commercial Floor Plans", "MEP Layout", "Fire Safety Plan", "Parking Layout"], order: 4 },
        { title: "Professional Consultancy", slug: "professional-consultancy", description: "End-to-end professional consultation for all your construction and planning needs.", icon: "💼", processSteps: ["Initial Assessment", "Feasibility Study", "Strategy Development", "Expert Consultation", "Regulatory Guidance", "Project Completion"], deliverables: ["Consultation Report", "Feasibility Analysis", "Project Timeline", "Budget Plan"], order: 5 },
    ];
    for (const s of services) {
        await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
    }
    console.log(`  ✅ ${services.length} services`);

    // --- Plans ---
    const plans = [
        { name: "Basic", slug: "basic", description: "Essential planning for small residential projects.", price: "₹4,999", features: ["2D Floor Plan", "Basic Elevation", "Site Plan", "7 Days Delivery", "1 Revision", "Email Support"], timeline: "7 Days", isFeatured: false, order: 0 },
        { name: "Standard", slug: "standard", description: "Comprehensive planning with 3D visualization and Vastu.", price: "₹14,999", features: ["Detailed Floor Plan", "3D Elevation Design", "Structural Drawing", "Vastu Compliance", "Section Views", "14 Days Delivery", "3 Revisions", "Phone Support"], timeline: "14 Days", isFeatured: true, order: 1 },
        { name: "Premium", slug: "premium", description: "Complete architectural and engineering package.", price: "₹29,999", features: ["Complete Architecture", "3D Walkthrough Video", "Structural + MEP", "Interior Layout", "Vastu Compliance", "21 Days Delivery", "Unlimited Revisions", "Dedicated Manager"], timeline: "21 Days", isFeatured: false, order: 2 },
        { name: "Custom", slug: "custom", description: "Tailored solutions for large-scale and special projects.", price: "Contact Us", features: ["Custom Project Scope", "Dedicated Project Manager", "Multi-building Support", "Full MEP Engineering", "Regulatory Filing", "24/7 Priority Support"], timeline: "As per scope", isFeatured: false, order: 3 },
    ];
    for (const p of plans) {
        await prisma.plan.upsert({ where: { slug: p.slug }, update: p, create: p });
    }
    console.log(`  ✅ ${plans.length} plans`);

    // --- Products ---
    const products = [
        { name: "Modern 2BHK Floor Plan", slug: "modern-2bhk", description: "Well-designed 2BHK layout with optimal space utilization and natural lighting.", price: "3999", category: "Residential", area: "1000", floors: 1, direction: "East", width: 20, depth: 50, bhk: "2BHK", vastu: "Yes", code: "AD-101", order: 0 },
        { name: "Luxury Villa Design", slug: "luxury-villa", description: "Premium villa design with landscaping, pool, and parking.", price: "24999", category: "Residential", area: "2500", floors: 2, direction: "North-East", width: 40, depth: 62.5, bhk: "4BHK", vastu: "Yes", code: "AD-102", order: 1 },
        { name: "Commercial Office Layout", slug: "commercial-office", description: "Efficient open-plan office designed for modern workplaces.", price: "14999", category: "Commercial", area: "2000", floors: 3, direction: "North", width: 40, depth: 50, bhk: "4BHK+", vastu: "Doesn't Matter", code: "AD-103", order: 2 },
        { name: "Retail Shop Design", slug: "retail-shop", description: "Eye-catching retail space design to maximize customer experience.", price: "7999", category: "Commercial", area: "750", floors: 1, direction: "West", width: 15, depth: 50, bhk: "1BHK", vastu: "No", code: "AD-104", order: 3 },
        { name: "Duplex House Plan", slug: "duplex-house", description: "Spacious duplex layout with separate living areas per floor.", price: "9999", category: "Residential", area: "1500", floors: 2, direction: "South", width: 30, depth: 50, bhk: "3BHK", vastu: "Yes", code: "AD-105", order: 4 },
        { name: "Restaurant Layout", slug: "restaurant-layout", description: "Optimized restaurant floor plan with kitchen, dining, and service areas.", price: "11999", category: "Commercial", area: "1800", floors: 1, direction: "North", width: 30, depth: 60, bhk: "2BHK", vastu: "Doesn't Matter", code: "AD-106", order: 5 },
    ];
    for (const p of products) {
        await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p });
    }
    console.log(`  ✅ ${products.length} products`);

    // --- Gallery ---
    const categories = ["Residential", "Commercial", "Interior", "Elevation", "Floor Plan"];
    for (const name of categories) {
        await prisma.galleryCategory.upsert({ where: { name }, update: { name }, create: { name, order: categories.indexOf(name) } });
    }
    console.log(`  ✅ ${categories.length} gallery categories`);

    // --- Testimonials ---
    await prisma.testimonial.deleteMany();
    const testimonials = [
        { name: "Rajesh Kumar", role: "Homeowner", company: "Mumbai", content: "Outstanding architectural planning service. The team delivered beyond our expectations with attention to every detail and perfect Vastu compliance.", rating: 5, order: 0 },
        { name: "Priya Sharma", role: "Builder", company: "Pune", content: "Professional team with excellent attention to detail. Their structural consultancy saved us significant costs. Highly recommended!", rating: 5, order: 1 },
        { name: "Amit Patel", role: "Business Owner", company: "Delhi", content: "Great commercial space design. The team understood our business needs perfectly and delivered a functional, beautiful office.", rating: 4, order: 2 },
    ];
    for (const t of testimonials) {
        await prisma.testimonial.create({ data: t });
    }
    console.log(`  ✅ ${testimonials.length} testimonials`);

    // --- Legal Pages ---
    const legalPages = [
        { title: "Terms & Services", slug: "terms-and-services", content: "## 1. Introduction\nWelcome to Advika Vastu-Structural. These Terms of Service govern your use of our website and services.\n\n## 2. Services\nAdvika Vastu-Structural provides architectural planning, structural consultancy, Vastu consultancy, and related professional services.\n\n## 3. Payment Terms\n- A minimum advance of 50% is required\n- Balance due upon delivery\n- All prices in INR inclusive of applicable taxes\n\n## 4. Intellectual Property\nAll designs remain our intellectual property until full payment is received.\n\n## 5. Governing Law\nGoverned by the laws of India." },
        { title: "Privacy Policy", slug: "privacy-policy", content: "## 1. Information We Collect\nWe collect information you voluntarily provide including name, email, phone, and project details.\n\n## 2. How We Use Your Information\n- Respond to inquiries and provide services\n- Communicate project updates\n- Improve our services\n\n## 3. Data Security\nWe implement appropriate security measures to protect your personal information.\n\n## 4. Contact\nFor privacy queries, contact privacy@advikavastu.in." },
        { title: "Refund Policy", slug: "refund-policy", content: "## 1. Cancellation\n- Before project commencement: 80% refund\n- After design phase begins: 50% refund\n- After first draft delivery: No refund\n\n## 2. Refund Process\nRefunds processed within 15 business days.\n\n## 3. Non-Refundable\nSite visit charges, government fees, third-party charges." },
        { title: "Disclaimer", slug: "disclaimer", content: "## General Disclaimer\nInformation on this website is for general informational purposes only.\n\n## Design Accuracy\nAll designs are for illustration purposes. Actual outputs may vary.\n\n## Pricing\nPrices are indicative and may vary based on project scope." },
    ];
    for (const lp of legalPages) {
        await prisma.legalPage.upsert({ where: { slug: lp.slug }, update: lp, create: lp });
    }
    console.log(`  ✅ ${legalPages.length} legal pages`);

    // --- Global Settings ---
    const settings = [
        { key: "company_name", value: "Advika Vastu-Structural" },
        { key: "tagline", value: "SAAS Solutions — Architecture, Planning & Vastu Consultancy" },
        { key: "email", value: "info@advikavastu.in" },
        { key: "phone", value: "+91 98765 43210" },
        { key: "whatsapp", value: "+91 98765 43210" },
        { key: "address", value: "India" },
        { key: "hero_title", value: "Expert Vastu-Compliant Architectural & Structural Solutions" },
        { key: "hero_subtitle", value: "India's trusted consultancy for residential & commercial architecture, structural planning, and Vastu-compliant designs." },
        { key: "stats_clients", value: "500+" },
        { key: "stats_projects", value: "1000+" },
        { key: "stats_experience", value: "15+" },
        { key: "stats_states", value: "25+" },
        { key: "about_intro", value: "Advika Vastu-Structural is a premier architectural planning and consultancy firm dedicated to creating harmonious, Vastu-compliant spaces. We combine ancient wisdom with modern engineering excellence." },
        { key: "founder_name", value: "Founder" },
        { key: "founder_role", value: "Founder & Principal Architect" },
        { key: "founder_bio", value: "With over 15 years of experience in architectural planning and structural consultancy, our founder established Advika Vastu-Structural with the vision of making professional Vastu-compliant architectural services accessible to everyone across India." },
        { key: "mission", value: "To provide world-class architectural and planning services that combine innovation with Vastu wisdom, making quality design accessible to every Indian homeowner and business." },
        { key: "vision", value: "To be India's most trusted Vastu-structural consultancy firm, known for creativity, reliability, and transforming spaces that inspire." },
        { key: "referral_title", value: "Refer & Earn Program" },
        { key: "referral_description", value: "Earn ₹500 for every successful project referral. Share our services with friends and family!" },
        { key: "popup_enabled", value: true },
        { key: "chatbot_enabled", value: true },
        { key: "chatbot_name", value: "Little Adu" },
        { key: "chatbot_greeting", value: "Hi! 👋 I'm Little Adu, your virtual assistant at Advika Vastu-Structural. How can I help you today?" },
    ];
    for (const s of settings) {
        await prisma.globalSettings.upsert({
            where: { key: s.key },
            update: { value: s.value as any },
            create: { key: s.key, value: s.value as any },
        });
    }
    console.log(`  ✅ ${settings.length} global settings`);

    // --- Calculators ---
    const calculators = [
        {
            name: "Construction Cost Calculator",
            slug: "construction-cost-calculator",
            description: "Estimate the construction cost for your project based on area, floors, and finish quality.",
            fields: [
                { name: "area", label: "Built-up Area", type: "number", min: 100, max: 50000, defaultValue: 1000, unit: "sq.ft" },
                { name: "floors", label: "Number of Floors", type: "number", min: 1, max: 10, defaultValue: 2, unit: "floors" },
                { name: "quality", label: "Finish Quality", type: "select", options: [{ label: "Standard", value: 1400 }, { label: "Premium", value: 1800 }, { label: "Luxury", value: 2500 }], defaultValue: 1400, unit: "₹/sq.ft" },
            ],
            formula: "area * floors * quality",
            resultLabel: "Estimated Construction Cost",
            resultUnit: "₹",
            order: 0,
        },
        {
            name: "Vastu Score Calculator",
            slug: "vastu-score-calculator",
            description: "Check the Vastu compliance score for your property based on key factors.",
            fields: [
                { name: "entrance", label: "Main Entrance Direction", type: "select", options: [{ label: "North", value: 90 }, { label: "East", value: 100 }, { label: "South", value: 60 }, { label: "West", value: 70 }, { label: "North-East", value: 95 }, { label: "South-East", value: 65 }, { label: "South-West", value: 55 }, { label: "North-West", value: 75 }], defaultValue: 90, unit: "pts" },
                { name: "kitchen", label: "Kitchen Placement", type: "select", options: [{ label: "South-East (Ideal)", value: 100 }, { label: "North-West", value: 80 }, { label: "Other", value: 50 }], defaultValue: 100, unit: "pts" },
                { name: "bedroom", label: "Master Bedroom Direction", type: "select", options: [{ label: "South-West (Ideal)", value: 100 }, { label: "South", value: 85 }, { label: "West", value: 75 }, { label: "Other", value: 50 }], defaultValue: 100, unit: "pts" },
                { name: "pooja", label: "Pooja Room Location", type: "select", options: [{ label: "North-East (Ideal)", value: 100 }, { label: "East", value: 85 }, { label: "Other", value: 50 }], defaultValue: 100, unit: "pts" },
            ],
            formula: "(entrance + kitchen + bedroom + pooja) / 4",
            resultLabel: "Vastu Compliance Score",
            resultUnit: "/100",
            order: 1,
        },
    ];
    for (const c of calculators) {
        await prisma.calculator.upsert({
            where: { slug: c.slug },
            update: { ...c, fields: c.fields as any },
            create: { ...c, fields: c.fields as any },
        });
    }
    console.log(`  ✅ ${calculators.length} calculators`);

    // --- CTA Section ---
    const existingCta = await prisma.ctaSection.findFirst();
    if (!existingCta) {
        await prisma.ctaSection.create({
            data: {
                headline: "Ready to Build Your Dream Project?",
                subtext: "Get expert Vastu-compliant architectural planning, structural consultancy, and engineering services. Start with a free consultation today.",
                buttonText: "Get Free Consultation",
                buttonUrl: "/contact",
                isVisible: true,
                order: 0,
            },
        });
    }
    console.log("  ✅ CTA section");

    // @ts-ignore - homePage exists but might not be in the generated types for the current environment
    await prisma.homePage.upsert({
        where: { id: "singleton" },
        update: {},
        create: {
            id: "singleton",
            headerTitle: "Advika Vastu-Structural",
            headerSubtitle: "Architecture | Structural | Vastu",
            heroTitle: "Easiest Way to Design Beautiful Homes and Spaces",
            heroDescription: "House plan, 3D building elevation designs, and interior designing services at best rates. Get your home expertly designed fast easy and affordably.",
            heroButtonText: "Explore Designs",
            heroButtonLink: "/services",
            footerContent: "© 2025 Advika Vastu-Structural. All rights reserved.",
            seoTitle: "Advika Vastu-Structural | Vastu-Compliant Architecture & Structural Solutions",
            seoDescription: "Expert architectural and structural consultancy services across India. Specialized in Vastu-compliant designs for residential and commercial projects.",
            seoKeywords: "architecture, vastu, structural engineering, planning, residential design, commercial design, india",
        },
    });
    console.log("  ✅ Home Page data");

    console.log("\n🎉 Database seeded successfully!");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });

export interface NavLink {
    label: string;
    href: string;
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface HomeService {
    id: string;
    title: string;
    description: string;
    icon?: string | null;
    slug: string;
}

export interface HomePlan {
    id: string;
    name: string;
    price: string;
    features: string[];
    isFeatured: boolean;
    slug: string;
}

export interface HomeTestimonial {
    id: string;
    name: string;
    role?: string | null;
    company?: string | null;
    content: string;
    rating: number;
}

export interface HomePageData {
    id: string;
    headerTitle: string;
    headerSubtitle: string;
    heroTitle: string;
    heroDescription: string;
    heroButtonText: string;
    heroButtonLink: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    address: string;
    socialLinks: SocialLink[];
    quickLinks: NavLink[];
    legalLinks: NavLink[];
    footerContent: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    ogImage: string;
    updatedAt?: string | Date;
}

export const DEFAULT_HOME_DATA: Partial<HomePageData> = {
    headerTitle: "Advika Vastu Structural",
    headerSubtitle: "Architecture | Structural | Vastu",
    heroTitle: "Expert Vastu-Compliant Architecture & Structural Solutions",
    heroDescription: "We provide professional architectural planning, structural consultancy, and Vastu-compliant designs for residential and commercial projects across India.",
    heroButtonText: "Explore Services",
    heroButtonLink: "/services",
    contactEmail: "admin@vastustructural.com",
    contactPhone: "+91 90679 69756",
    whatsappNumber: "+91 90679 69756",
    address: "Servicing All of India",
    seoTitle: "Advika Vastu Structural - Expert Architecture & Structural Solutions",
    seoDescription: "Professional Vastu-compliant architectural planning and structural consultancy services across India.",
    seoKeywords: "Vastu, Architecture, Structural Design, Engineering, India",
    socialLinks: [],
    quickLinks: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Plans", href: "/plans" },
        { label: "Contact", href: "/contact" }
    ],
    legalLinks: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" }
    ]
};

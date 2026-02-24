import { getServices, getPlans, getTestimonials, getSettings, getCalculators, getCtaSections, getHomePageData } from "@/lib/data";
import HomeContent from "./HomeContent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getHomePageData();

  if (!homeData) return {};

  return {
    title: homeData.seoTitle || undefined,
    description: homeData.seoDescription || undefined,
    keywords: homeData.seoKeywords || undefined,
    openGraph: {
      title: homeData.seoTitle || undefined,
      description: homeData.seoDescription || undefined,
      images: homeData.ogImage ? [{ url: homeData.ogImage }] : undefined,
    },
  };
}

export default async function HomePage() {
  const [services, plans, testimonials, settings, calculators, ctaSections, homeData] = await Promise.all([
    getServices(),
    getPlans(),
    getTestimonials(),
    getSettings(),
    getCalculators(),
    getCtaSections(),
    getHomePageData(),
  ]);

  return (
    <HomeContent
      services={services as any}
      plans={plans as any}
      testimonials={testimonials as any}
      settings={settings}
      calculators={calculators as any}
      ctaSections={ctaSections as any}
      homeData={homeData}
    />
  );
}

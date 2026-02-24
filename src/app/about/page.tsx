import { getSettings } from "@/lib/data";
import AboutContent from "./AboutContent";

export default async function AboutPage() {
    const settings = await getSettings();
    return <AboutContent settings={settings} />;
}

import { getServices } from "@/lib/data";
import ServicesContent from "./ServicesContent";

export default async function ServicesPage() {
    const services = await getServices();
    return <ServicesContent services={services as any} />;
}

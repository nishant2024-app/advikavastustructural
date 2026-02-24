import { getPlans } from "@/lib/data";
import PlansContent from "./PlansContent";

export default async function PlansPage() {
    const plans = await getPlans();
    return <PlansContent plans={plans} />;
}

import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas"; // Keep ZoneArea import for type
import ZoneAreasClientWrapper from "./zone-areas-client-wrapper"; // Import the new client wrapper

// Server Component: fetches data
export default async function ZoneAreasPage() {
  const initialZoneAreas = await getZoneAreas();

  return (
    <ZoneAreasClientWrapper initialZoneAreas={initialZoneAreas} />
  );
}

import RoadMapEnhanced from "@/components/RoadMapTest";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function RoadmapPage() {
  const user = await getCurrentUser();
  
  return (
    <RoadMapEnhanced 
      userId={user?.id || null} 
      userName={user?.name || null} 
    />
  );
}
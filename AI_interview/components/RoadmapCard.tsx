// components/RoadmapCard.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RoadmapCardProps = {
  userId: string;
  roadmapId: string;
  jobRole: string;
  currentPosition: string;
  targetTimeline: string;
  createdAt: string | Date;
};

export default function RoadmapCard({
  userId,
  roadmapId,
  jobRole,
  currentPosition,
  targetTimeline,
  createdAt
}: RoadmapCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="card-border h-full hover:shadow-lg transition-shadow p-6 rounded-lg border border-dark-300 bg-dark-200">
      <div className="mb-4">
        <h3 className="text-white text-lg font-semibold line-clamp-1">{jobRole}</h3>
        <div className="flex items-center justify-between text-sm text-light-100 mt-2">
          <span>From {currentPosition}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-light-100">Target: {targetTimeline}</span>
        </div>
      </div>
      
      <Button asChild className="btn-secondary w-full">
        <Link href={`/roadmap/${roadmapId}`}>
          View Roadmap
        </Link>
      </Button>
    </div>
  );
}
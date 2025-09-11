import { getRoadmapById } from '@/lib/actions/roadmap.action';
import { Roadmap as RoadmapType } from '@/types';
import { notFound } from 'next/navigation';
import RoadmapDetail from '@/components/RoadmapDetail';

interface RoadmapPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { id } = await params;
  
  try {
    const roadmap = await getRoadmapById(id);
    
    if (!roadmap) {
      notFound();
    }

    return <RoadmapDetail roadmap={roadmap} />;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: RoadmapPageProps) {
  const { id } = await params;
  const roadmap = await getRoadmapById(id);
  
  return {
    title: roadmap ? `Roadmap: ${roadmap.jobRole}` : 'Roadmap Not Found',
    description: roadmap ? `Career roadmap for ${roadmap.jobRole}` : 'Roadmap not found',
  };
}
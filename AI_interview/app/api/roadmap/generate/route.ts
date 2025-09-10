import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/actions/roadmap.action';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['jobRole', 'currentPosition', 'experienceLevel', 'targetTimeline', 'userId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure skills and goals are arrays
    const formattedBody = {
      ...body,
      skills: Array.isArray(body.skills) ? body.skills : [],
      goals: Array.isArray(body.goals) ? body.goals : []
    };

    const roadmap = await generateRoadmap(formattedBody);
    
    return NextResponse.json(roadmap);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
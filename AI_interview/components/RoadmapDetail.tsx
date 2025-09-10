"use client";

import { Roadmap } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

interface RoadmapDetailProps {
  roadmap: Roadmap;
}

export default function RoadmapDetail({ roadmap }: RoadmapDetailProps) {
  const router = useRouter();

  if (!roadmap.content) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Roadmap Not Ready</h1>
          <p className="text-light-100">This roadmap is still being generated. Please try again later.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back to Roadmaps
        </Button>
        <h1 className="text-4xl font-bold text-white mb-2">{roadmap.content.title}</h1>
        <p className="text-light-100 text-lg mb-4">{roadmap.content.overview}</p>
        <div className="flex justify-center gap-4 text-sm text-light-100">
          <span>Timeline: {roadmap.content.timeline}</span>
          <span>•</span>
          <span>Progress: {roadmap.progress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-dark-300 rounded-full h-2.5">
          <div 
            className="bg-primary-100 h-2.5 rounded-full" 
            style={{ width: `${roadmap.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Learning Path</h2>
        {roadmap.content.milestones?.map((milestone: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; duration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; skills: any[]; resources: any[]; projects: any[]; }, index: number) => (
          <div key={index} className="card-border p-6 rounded-lg border border-dark-300 bg-dark-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100/20 rounded-full flex items-center justify-center">
                <span className="text-primary-100 font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                <p className="text-light-100 mb-3">{milestone.description}</p>
                <p className="text-primary-100 mb-4">Duration: {milestone.duration}</p>

                {/* Skills */}
                {milestone.skills && milestone.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Skills to Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-primary-100/20 text-primary-100 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {milestone.resources && milestone.resources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Resources:</h4>
                    <ul className="space-y-2">
                      {milestone.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="text-light-100">
                          <strong>{resource.type}:</strong>{' '}
                          {resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-100 hover:underline"
                            >
                              {resource.title}
                            </a>
                          ) : (
                            resource.title
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects */}
                {milestone.projects && milestone.projects.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Projects:</h4>
                    <ul className="list-disc list-inside text-light-100 space-y-1">
                      {milestone.projects.map((project, projectIndex) => (
                        <li key={projectIndex}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interview Preparation */}
      {roadmap.content.interviewPrep && (
        <div className="mt-12 card-border p-6 rounded-lg border border-dark-300 bg-dark-200">
          <h2 className="text-2xl font-bold text-white mb-4">Interview Preparation</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Technical Topics</h3>
              <ul className="list-disc list-inside text-light-100 space-y-1">
                {roadmap.content.interviewPrep.technical.map((topic: string, index: number) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>

            {/* Behavioral */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Behavioral Questions</h3>
              <ul className="list-disc list-inside text-light-100 space-y-1">
                {roadmap.content.interviewPrep.behavioral.map((question: string, index: number) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          {roadmap.content.interviewPrep.resources && roadmap.content.interviewPrep.resources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-3">Recommended Resources</h3>
              <ul className="list-disc list-inside text-light-100 space-y-1">
                {roadmap.content.interviewPrep.resources.map(
                  (resource: { title: string }, index: number) => (
                    <li key={index}>{resource.title}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button onClick={() => router.push('/roadmap')} variant="outline">
          Create Another Roadmap
        </Button>
        <Button onClick={() => window.print()} className="bg-primary-100 hover:bg-primary-120">
          Print Roadmap
        </Button>
      </div>
    </div>
  );
}
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
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 w-full">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-3 sm:mb-4 w-full sm:w-auto"
          style={{backgroundColor: '#1F2937'}}
        >
          ← Back to Roadmaps
        </Button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{roadmap.content.title}</h1>
        <p className="text-light-100 text-base sm:text-lg mb-4 px-2 sm:px-0">{roadmap.content.overview}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-sm text-light-100">
          <span className='text-sm sm:text-lg'>Timeline: {roadmap.content.timeline}</span>
        </div>
      </div>



      {/* Milestones */}
      <div className="space-y-4 sm:space-y-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white px-2 sm:px-0">Learning Path</h2>
        {roadmap.content.milestones?.map((milestone: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; duration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; skills: any[]; resources: any[]; projects: any[]; }, index: number) => (
          <div key={index} className="card-border p-4 sm:p-6 rounded-lg border border-dark-300 bg-dark-200 w-full">
            <div className="w-full">
              {/* Milestone Header */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-100/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-100 font-bold text-sm sm:text-base">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 break-words">{milestone.title}</h3>
                  <p className="text-light-100 mb-3 text-sm sm:text-base leading-relaxed">{milestone.description}</p>
                  <p className="text-primary-100 mb-4 text-sm sm:text-base">Duration: {milestone.duration}</p>
                </div>
              </div>

              {/* Content Grid - Responsive Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                {/* Skills */}
                {milestone.skills && milestone.skills.length > 0 && (
                  <div className="w-full">
                    <h4 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-primary-100/20 pb-2">Skills to Learn</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {milestone.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-primary-100/20 text-primary-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm break-words"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {milestone.resources && milestone.resources.length > 0 && (
                  <div className="w-full">
                    <h4 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-success-100/20 pb-2">Resources</h4>
                    <ul className="space-y-1 sm:space-y-2">
                      {milestone.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="text-light-100 text-sm sm:text-base break-words">
                          <strong className="text-success-100">{resource.type}:</strong>{' '}
                          {resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-100 hover:underline break-all"
                            >
                              {resource.title}
                            </a>
                          ) : (
                            <span className="break-words">{resource.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects */}
                {milestone.projects && milestone.projects.length > 0 && (
                  <div className="w-full">
                    <h4 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-accent-100/20 pb-2">Projects</h4>
                    <ul className="list-disc list-inside text-light-100 space-y-1 sm:space-y-2">
                      {milestone.projects.map((project, projectIndex) => (
                        <li key={projectIndex} className="text-light-100 text-sm sm:text-base break-words leading-relaxed">{project}</li>
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
        <div className="mt-8 sm:mt-12 card-border p-4 sm:p-6 rounded-lg border border-dark-300 bg-dark-200 w-full">
          <div className="w-full">
            {/* Interview Preparation Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Interview Preparation</h2>
              <p className="text-light-100 text-sm sm:text-base">Practice these topics and questions to ace your interview</p>
            </div>

            {/* Content Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
              {/* Technical Topics */}
              <div className="w-full">
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-primary-100/20 pb-2">Technical Topics</h3>
                <ul className="list-disc list-inside text-light-100 space-y-1 sm:space-y-2">
                  {roadmap.content.interviewPrep.technical.map((topic: string, index: number) => (
                    <li key={index} className="text-light-100 text-sm sm:text-base break-words leading-relaxed">{topic}</li>
                  ))}
                </ul>
              </div>

              {/* Behavioral Questions */}
              <div className="w-full">
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-success-100/20 pb-2">Behavioral Questions</h3>
                <ul className="list-disc list-inside text-light-100 space-y-1 sm:space-y-2">
                  {roadmap.content.interviewPrep.behavioral.map((question: string, index: number) => (
                    <li key={index} className="text-light-100 text-sm sm:text-base break-words leading-relaxed">{question}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resources - Full Width */}
            {roadmap.content.interviewPrep.resources && roadmap.content.interviewPrep.resources.length > 0 && (
              <div className="mt-4 sm:mt-6 w-full">
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-base sm:text-lg border-b border-accent-100/20 pb-2">Recommended Resources</h3>
                <ul className="list-disc list-inside text-light-100 space-y-1 sm:space-y-2">
                  {roadmap.content.interviewPrep.resources.map(
                    (resource: { title: string }, index: number) => (
                      <li key={index} className="text-light-100 text-sm sm:text-base break-words leading-relaxed">{resource.title}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 flex-col sm:flex-row">
        <Button onClick={() => router.push('/roadmap')} variant="outline" className='w-full sm:flex-1 bg-primary-500 hover:bg-primary-600 text-white border-primary-500 hover:border-primary-600 transition-all duration-200 py-2 sm:py-3 text-sm sm:text-base'>
          Create Another Roadmap
        </Button>
        <Button onClick={() => window.print()} className="w-full sm:flex-1 bg-fuchsia-100 hover:bg-dark-400 text-black border-dark-300 hover:border-dark-400 transition-all duration-200 py-2 sm:py-3 text-sm sm:text-base">
          Print Roadmap
        </Button>
      </div>
    </div>
  );
}
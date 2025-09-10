import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import RoadmapCard from "@/components/RoadmapCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getUserRoadmaps } from "@/lib/actions/roadmap.action";

async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-scaleIn">
        <div className="p-4 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl shadow-xl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L24 9L36 15L24 21L12 15Z" fill="#020408" fillOpacity="0.8"/>
            <path d="M12 21L24 15L36 21L24 27L12 21Z" fill="#020408" fillOpacity="0.6"/>
            <path d="M12 27L24 21L36 27L24 33L12 27Z" fill="#020408" fillOpacity="0.8"/>
            <circle cx="24" cy="21" r="3" fill="#020408"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white">Welcome to SkillSync</h1>
        <p className="text-xl text-light-100 max-w-md">
          Your AI-powered interview preparation platform. Please sign in to access your dashboard.
        </p>
        <Link href="/sign-in">
          <Button className="btn-primary px-8 py-3 text-lg">Get Started</Button>
        </Link>
      </div>
    );
  }

  const [userInterviews, allInterview, userRoadmaps] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
    getUserRoadmaps(user.id),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;
  const hasRoadmaps = userRoadmaps?.length! > 0;

  return (
    <>
      <section className="card-cta animate-scaleIn">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-white">
            Master Your Interview Skills with SkillSync AI-Powered Practice & Feedback
          </h2>
          <p className="text-xl text-light-100 leading-relaxed">
            Practice real interview scenarios and receive instant, personalized feedback to boost your confidence
          </p>

          <div className="flex gap-4">
            <Button asChild className="btn-primary max-sm:w-full text-lg px-8 py-3">
              <Link href="/interview">Start Interview</Link>
            </Button>
            <Button asChild className="btn-secondary max-sm:w-full text-lg px-8 py-3">
              <Link href="/roadmap">Create Roadmap</Link>
            </Button>
          </div>
        </div>

        <div className="animate-fadeIn">
          <Image
            src="/robot.png"
            alt="SkillSync AI Assistant"
            width={400}
            height={400}
            className="max-sm:hidden transition-transform duration-500 hover:scale-110"
          />
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="flex flex-col gap-8 mt-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 bg-gradient-to-b from-accent-100 to-accent-200 rounded-full"></div>
          <h2 className="text-white text-3xl font-bold">Your Career Roadmaps</h2>
        </div>

        {/* Career Readiness Test Card */}
        <div className="bg-gradient-to-r from-accent-100/20 to-accent-200/20 rounded-xl p-6 border border-accent-100/30 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Career Readiness Assessment</h3>
              <p className="text-light-100 mb-4">
                Take our comprehensive assessment to evaluate your skills, identify gaps, and get personalized recommendations for your career development.
              </p>
              <Button asChild className="bg-accent-100 hover:bg-accent-200 text-white-100">
                <Link href="/career-ready">Start Assessment</Link>
              </Button>
            </div>
            <div className="bg-accent-100/20 p-4 rounded-lg">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6C14.058 6 6 14.058 6 24C6 33.942 14.058 42 24 42C33.942 42 42 33.942 42 24C42 14.058 33.942 6 24 6ZM24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24C38 31.732 31.732 38 24 38Z" fill="#FFD166"/>
                <path d="M22 22H26V32H22V22ZM24 18C24.828 18 25.5 17.328 25.5 16.5C25.5 15.672 24.828 15 24 15C23.172 15 22.5 15.672 22.5 16.5C22.5 17.328 23.172 18 24 18Z" fill="#FFD166"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="interviews-section">
          {hasRoadmaps ? (
            userRoadmaps?.map((roadmap, index) => (
              <div 
                key={roadmap.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RoadmapCard
                  userId={user.id}
                  roadmapId={roadmap.id}
                  jobRole={roadmap.jobRole}
                  currentPosition={roadmap.currentPosition}
                  targetTimeline={roadmap.targetTimeline}
                  createdAt={roadmap.createdAt}
                  progress={roadmap.progress || 0}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-100 to-accent-200 rounded-full mx-auto flex items-center justify-center opacity-50">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6L10 12L16 18L22 12L16 6Z" stroke="#020408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12L6 16L10 20L14 16L10 12Z" stroke="#020408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12L26 16L22 20L18 16L22 12Z" stroke="#020408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 18L10 24L16 30L22 24L16 18Z" stroke="#020408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-accent-100">Plan your career path</h3>
                <p className="text-light-100 max-w-md mx-auto">
                  Create a personalized roadmap to guide your career development and skill acquisition.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/roadmap">Create Roadmap</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-8 mt-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 bg-gradient-to-b from-primary-100 to-primary-200 rounded-full"></div>
          <h2 className="text-white text-3xl font-bold">Your Interview Progress</h2>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview, index) => (
              <div 
                key={interview.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <InterviewCard
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mx-auto flex items-center justify-center opacity-50">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8V24M8 16H24" stroke="#020408" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-100">Ready to begin?</h3>
                <p className="text-light-100 max-w-md mx-auto">
                  You haven't taken any interviews yet. Start your first interview to begin tracking your progress and improving your skills.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-8 mt-12 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 bg-gradient-to-b from-success-100 to-success-200 rounded-full"></div>
          <h2 className="text-white text-3xl font-bold">Available Practice Sessions</h2>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview, index) => (
              <div 
                key={interview.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <InterviewCard
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-success-100 to-success-200 rounded-full mx-auto flex items-center justify-center opacity-50">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L13 16L23 6" stroke="#020408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-success-100">All up to date!</h3>
                <p className="text-light-100 max-w-md mx-auto">
                  No new interview sessions are available right now. Check back later for fresh challenges, or create your own custom interview.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
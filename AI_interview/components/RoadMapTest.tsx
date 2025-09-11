"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
interface RoadMapProps {
  userId: string | null;
  userName: string | null;
}

// Predefined options for dropdowns
const JOB_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist",
  "Machine Learning Engineer", "DevOps Engineer", "Mobile Developer", "UI/UX Designer",
  "Product Manager", "Software Architect", "Cloud Engineer", "Data Engineer",
  "QA Engineer", "Security Engineer", "Technical Writer"
];

const CURRENT_POSITIONS = [
  "Student", "Intern", "Junior Developer", "Mid-level Developer", "Senior Developer",
  "Team Lead", "Engineering Manager", "Career Changer", "Unemployed", "Freelancer"
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" }
];

const TARGET_TIMELINES = [
  { value: "3 months", label: "3 months" },
  { value: "6 months", label: "6 months" },
  { value: "1 year", label: "1 year" },
  { value: "2 years", label: "2+ years" }
];

const SKILLS_OPTIONS = [
  "HTML/CSS", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js",
  "Python", "Java", "C#", "PHP", "Ruby", "Go", "Rust", "SQL", "NoSQL",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Git",
  "REST APIs", "GraphQL", "Testing", "Agile/Scrum"
];

const GOALS_OPTIONS = [
  "Get first job in tech", "Advance to senior position", "Switch to a different tech stack",
  "Become a team lead", "Transition to management", "Start freelance career",
  "Build personal projects", "Contribute to open source", "Learn new programming language",
  "Master a specific framework", "Improve system design skills", "Enhance problem-solving abilities",
  "Prepare for technical interviews", "Build a portfolio", "Network with professionals"
];

function RoadMap({ userId, userName }: RoadMapProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobRole: "",
    currentPosition: "",
    experienceLevel: "",
    targetTimeline: "",
    skills: [] as string[],
    goals: [] as string[],
  });
  const [customSkill, setCustomSkill] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleMultiSelectChange = (name: "skills" | "goals", value: string) => {
    setFormData(prev => {
      const currentValues = prev[name];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
    setError(null);
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill("");
    }
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !formData.goals.includes(customGoal.trim())) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, customGoal.trim()]
      }));
      setCustomGoal("");
    }
  };

  const removeItem = (name: "skills" | "goals", value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError("Please sign in to create a roadmap");
      return;
    }

    if (!formData.jobRole || !formData.currentPosition || !formData.experienceLevel || !formData.targetTimeline) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roadmap');

      router.push(`/roadmap/${data.id}`);
    } catch (error: any) {
      console.error("Error generating roadmap:", error);
      setError(error.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="animate-slideUp flex justify-between items-center p-4 bg-dark-200/50 rounded-2xl border border-primary-200/20 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg p-1">
            <Image 
              src="/logo.png" 
              alt="SkillSync Logo" 
              width={40} 
              height={40}
              className="object-contain rounded-full"
            />
          </div>
          <h2 className="text-primary-100 font-bold">SkillSync</h2>
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7L9 2L16 7V15C16 15.5523 15.5523 16 15 16H11V12H7V16H3C2.44772 16 2 15.5523 2 15V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              href="/interview" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L11.09 5.26L17 6L13 9.74L13.82 15.74L9 13.77L4.18 15.74L5 9.74L1 6L6.91 5.26L9 1Z" fill="currentColor"/>
              </svg>
              <span className="font-medium">Interview</span>
            </Link>
            
            <Link 
              href="/roadmap" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3H16C16.5523 3 17 3.44772 17 4V14C17 14.5523 16.5523 15 16 15H2C1.44772 15 1 14.5523 1 14V4C1 3.44772 1.44772 3 2 3Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 7H17M5 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-medium">Roadmap</span>
            </Link>
            
            <Link 
              href="/career-ready" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L11 7H17L12 11L14 17L9 13L4 17L6 11L1 7H7L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">Assessment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="mobile-menu-btn p-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </nav>
      {/* Header Section */}
      <div className="text-center mb-12 animate-fadeIn mt-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Create Your Career Roadmap
        </h1>
        <p className="text-light-100 text-lg max-w-2xl mx-auto">
          Get a personalized roadmap crafted by AI to accelerate your journey from where you are to where you want to be in tech.
        </p>
        {userName && (
          <div className="inline-flex items-center gap-3 mt-6 px-4 py-2 bg-success-100/20 border border-success-100/30 rounded-full">
            <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
            <span className="text-success-100 font-medium">Welcome back, {userName}!</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="card-background rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Career Foundation */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="jobRole" className="text-white block">Desired Job Role *</label>
              <select
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select your desired job role</option>
                {JOB_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="currentPosition" className="text-white block">Current Position *</label>
              <select
                id="currentPosition"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select your current position</option>
                {CURRENT_POSITIONS.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="experienceLevel" className="text-white block">Experience Level *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select your experience level</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="targetTimeline" className="text-white block">Target Timeline *</label>
              <select
                id="targetTimeline"
                name="targetTimeline"
                value={formData.targetTimeline}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select your target timeline</option>
                {TARGET_TIMELINES.map(timeline => (
                  <option key={timeline.value} value={timeline.value}>{timeline.label}</option>
                ))}
              </select>
            </div>
          </div>


          {/* Step 2: Skills */}
          <div className="border-t border-dark-300/50 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-success-100 to-success-200 rounded-full flex items-center justify-center">
                <span className="text-white-100 font-bold text-sm">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Current Skills</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SKILLS_OPTIONS.map(skill => (
                  <label key={skill} className="group cursor-pointer">
                    <div className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.skills.includes(skill)
                        ? 'border-primary-100 bg-primary-100/20'
                        : 'border-dark-300/50 bg-dark-300/20 hover:border-primary-100/50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleMultiSelectChange("skills", skill)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.skills.includes(skill)
                            ? 'border-primary-100 bg-primary-100'
                            : 'border-gray-400'
                        }`}>
                          {formData.skills.includes(skill) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          formData.skills.includes(skill) ? 'text-white' : 'text-light-100'
                        }`}>
                          {skill}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
                <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="flex-1 p-2 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <Button
                type="button"
                onClick={addCustomSkill}
                className="bg-primary-100 hover:bg-primary-120"
              >
                Add
              </Button>
            </div>
              
              {formData.skills.length > 0 && (
                <div className="bg-dark-300/30 rounded-xl p-4 border border-dark-300/50">
                  <p className="text-white font-medium mb-3">Selected Skills ({formData.skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 bg-primary-100/20 border border-primary-100/30 text-primary-100 px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeItem("skills", skill)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Goals */}
          <div className="border-t border-dark-300/50 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-100 to-accent-200 rounded-full flex items-center justify-center">
                <span className="text-white-100 font-bold text-sm">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Career Goals</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GOALS_OPTIONS.map(goal => (
                  <label key={goal} className="group cursor-pointer">
                    <div className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.goals.includes(goal)
                        ? 'border-accent-100 bg-accent-100/20'
                        : 'border-dark-300/50 bg-dark-300/20 hover:border-accent-100/50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal)}
                        onChange={() => handleMultiSelectChange("goals", goal)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.goals.includes(goal)
                            ? 'border-accent-100 bg-accent-100'
                            : 'border-gray-400'
                        }`}>
                          {formData.goals.includes(goal) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          formData.goals.includes(goal) ? 'text-white' : 'text-light-100'
                        }`}>
                          {goal}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
             <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Add custom goal"
                className="flex-1 p-2 rounded bg-dark-300 border border-dark-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <Button
                type="button"
                onClick={addCustomGoal}
                className="bg-primary-100 hover:bg-primary-120"
              >
                Add
              </Button>
            </div>
              
              {formData.goals.length > 0 && (
                <div className="bg-dark-300/30 rounded-xl p-4 border border-dark-300/50">
                  <p className="text-white font-medium mb-3">Selected Goals ({formData.goals.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.goals.map(goal => (
                      <span
                        key={goal}
                        className="inline-flex items-center gap-2 bg-accent-100/20 border border-accent-100/30 text-accent-100 px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        {goal}
                        <button
                          type="button"
                          onClick={() => removeItem("goals", goal)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="border-t border-dark-300/50 pt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-dark-300/50 border border-dark-300/70 text-light-100 rounded-lg hover:bg-dark-300/70 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !userId}
                className="flex-1 px-6 py-3 bg-primary-100 border border-primary-100 text-white rounded-lg hover:bg-primary-100/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 text-black border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating Roadmap...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Generate My Roadmap
                  </div>
                )}
              </button>
            </div>
            
            {!userId && (
              <p className="text-center text-red-400 mt-4 text-sm">
                Please sign in to create and save your personalized roadmap
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoadMap;

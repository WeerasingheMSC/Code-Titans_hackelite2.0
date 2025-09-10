"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RoadMapProps {
  userId: string | null;
  userName: string | null;
}

// Predefined options for dropdowns
const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Mobile Developer",
  "UI/UX Designer",
  "Product Manager",
  "Software Architect",
  "Cloud Engineer",
  "Data Engineer",
  "QA Engineer",
  "Security Engineer",
  "Technical Writer"
];

const CURRENT_POSITIONS = [
  "Student",
  "Intern",
  "Junior Developer",
  "Mid-level Developer",
  "Senior Developer",
  "Team Lead",
  "Engineering Manager",
  "Career Changer",
  "Unemployed",
  "Freelancer"
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
  "HTML/CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "SQL",
  "NoSQL",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "REST APIs",
  "GraphQL",
  "Testing",
  "Agile/Scrum"
];

const GOALS_OPTIONS = [
  "Get first job in tech",
  "Advance to senior position",
  "Switch to a different tech stack",
  "Become a team lead",
  "Transition to management",
  "Start freelance career",
  "Build personal projects",
  "Contribute to open source",
  "Learn new programming language",
  "Master a specific framework",
  "Improve system design skills",
  "Enhance problem-solving abilities",
  "Prepare for technical interviews",
  "Build a portfolio",
  "Network with professionals"
];

export default function RoadMap({ userId, userName }: RoadMapProps) {
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

    // Validate required fields
    if (!formData.jobRole || !formData.currentPosition || !formData.experienceLevel || !formData.targetTimeline) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          userId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      router.push(`/roadmap/${data.id}`);
    } catch (error: any) {
      console.error("Error generating roadmap:", error);
      setError(error.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-4">Create Your Career Roadmap</h1>
        <p className="text-light-100 text-lg">
          Answer a few questions about your career goals, and we'll generate a personalized roadmap to help you achieve them.
        </p>
        {userName && (
          <p className="text-primary-100 mt-2">Welcome, {userName}!</p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card-border animate-scaleIn p-8 rounded-lg border border-dark-300 bg-dark-200">
        <h2 className="text-2xl text-white text-center mb-6">
          Career Information
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-4">
            <label className="text-white block">Current Skills</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <div key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skill-${skill}`}
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleMultiSelectChange("skills", skill)}
                    className="mr-2 h-4 w-4 text-primary-100 focus:ring-primary-100 border-dark-400 rounded"
                  />
                  <label htmlFor={`skill-${skill}`} className="text-light-100 text-sm">
                    {skill}
                  </label>
                </div>
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
              <div className="mt-4">
                <p className="text-light-100 mb-2">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-primary-100/20 text-primary-100 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeItem("skills", skill)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-white block">Career Goals</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {GOALS_OPTIONS.map(goal => (
                <div key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`goal-${goal}`}
                    checked={formData.goals.includes(goal)}
                    onChange={() => handleMultiSelectChange("goals", goal)}
                    className="mr-2 h-4 w-4 text-primary-100 focus:ring-primary-100 border-dark-400 rounded"
                  />
                  <label htmlFor={`goal-${goal}`} className="text-light-100 text-sm">
                    {goal}
                  </label>
                </div>
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
              <div className="mt-4">
                <p className="text-light-100 mb-2">Selected Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.goals.map(goal => (
                    <span
                      key={goal}
                      className="bg-success-100/20 text-success-100 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeItem("goals", goal)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading || !userId}
            >
              {isLoading ? "Generating Roadmap..." : "Generate Roadmap"}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6 animate-slideUp">
        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Personalized Plan</h3>
            <p className="text-light-100 text-sm">Get a customized roadmap based on your specific goals and current level</p>
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-success-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Actionable Steps</h3>
            <p className="text-light-100 text-sm">Clear milestones and actionable tasks to keep you on track</p>
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Resource Guidance</h3>
            <p className="text-light-100 text-sm">Recommended courses, books, and resources to accelerate your learning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
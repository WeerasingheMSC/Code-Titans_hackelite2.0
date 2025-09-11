"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  checked: boolean;
}

interface AssessmentResult {
  score: number;
  level: "novice" | "developing" | "competent" | "proficient" | "expert";
  recommendations: string[];
}

export default function CareerReady() {
  const [categories, setCategories] = useState<SkillCategory[]>([
    {
      id: "technical",
      name: "Technical Skills",
      icon: "🔧",
      skills: [
        { id: "tech-1", name: "Programming Languages", description: "Proficiency in relevant programming languages for your field", level: "advanced", checked: false },
        { id: "tech-2", name: "Frameworks & Libraries", description: "Knowledge of industry-standard frameworks and libraries", level: "intermediate", checked: false },
        { id: "tech-3", name: "Version Control", description: "Experience with Git, GitHub, and collaborative development", level: "intermediate", checked: false },
        { id: "tech-4", name: "Testing & Quality Assurance", description: "Ability to write tests and ensure code quality", level: "intermediate", checked: false },
        { id: "tech-5", name: "Debugging & Troubleshooting", description: "Proficiency in identifying and solving technical issues", level: "advanced", checked: false },
        { id: "tech-6", name: "Database Management", description: "Understanding of database design and query optimization", level: "intermediate", checked: false },
        { id: "tech-7", name: "API Development", description: "Experience with RESTful APIs and web services", level: "intermediate", checked: false },
      ]
    },
    {
      id: "soft",
      name: "Professional Skills",
      icon: "🤝",
      skills: [
        { id: "soft-1", name: "Communication", description: "Clear verbal and written communication skills", level: "advanced", checked: false },
        { id: "soft-2", name: "Teamwork & Collaboration", description: "Ability to work effectively in diverse teams", level: "advanced", checked: false },
        { id: "soft-3", name: "Problem Solving", description: "Analytical thinking and creative solution development", level: "advanced", checked: false },
        { id: "soft-4", name: "Time Management", description: "Ability to prioritize tasks and meet deadlines", level: "intermediate", checked: false },
        { id: "soft-5", name: "Leadership", description: "Capability to guide and mentor team members", level: "intermediate", checked: false },
        { id: "soft-6", name: "Adaptability", description: "Flexibility in learning new technologies and processes", level: "intermediate", checked: false },
      ]
    },
    {
      id: "interview",
      name: "Interview Readiness",
      icon: "💼",
      skills: [
        { id: "int-1", name: "Resume Optimization", description: "Well-crafted, ATS-friendly, and tailored resume", level: "beginner", checked: false },
        { id: "int-2", name: "Portfolio Development", description: "Comprehensive showcase of relevant projects and skills", level: "intermediate", checked: false },
        { id: "int-3", name: "Technical Interview Prep", description: "Practice with coding challenges and system design", level: "advanced", checked: false },
        { id: "int-4", name: "Behavioral Interview Prep", description: "STAR method and situational question preparation", level: "intermediate", checked: false },
        { id: "int-5", name: "Company Research", description: "Understanding of target companies and industry trends", level: "beginner", checked: false },
        { id: "int-6", name: "Salary Negotiation", description: "Knowledge of market rates and negotiation strategies", level: "intermediate", checked: false },
      ]
    },
    {
      id: "industry",
      name: "Industry Knowledge",
      icon: "📊",
      skills: [
        { id: "ind-1", name: "Industry Trends", description: "Understanding of current and emerging trends in your field", level: "intermediate", checked: false },
        { id: "ind-2", name: "Business Acumen", description: "Understanding of how technology drives business value", level: "intermediate", checked: false },
        { id: "ind-3", name: "Networking", description: "Professional network and industry connections", level: "beginner", checked: false },
        { id: "ind-4", name: "Continuous Learning", description: "Commitment to ongoing skill development and education", level: "intermediate", checked: false },
      ]
    }
  ]);

  const [readinessScore, setReadinessScore] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const calculateReadiness = () => {
    const totalSkills = categories.flatMap(cat => cat.skills).length;
    const checkedSkills = categories.flatMap(cat => cat.skills).filter(skill => skill.checked).length;
    const score = Math.round((checkedSkills / totalSkills) * 100);
    setReadinessScore(score);

    // Calculate detailed assessment
    const result = getAssessmentResult(score, categories);
    setAssessmentResult(result);
    setShowDetailedResults(true);
  };

  const getAssessmentResult = (score: number, categories: SkillCategory[]): AssessmentResult => {
    let level: AssessmentResult["level"];
    let recommendations: string[] = [];

    if (score >= 90) {
      level = "expert";
      recommendations = [
        "You're ready to pursue senior-level positions",
        "Consider mentoring others and contributing to open source",
        "Focus on leadership and strategic thinking skills"
      ];
    } else if (score >= 75) {
      level = "proficient";
      recommendations = [
        "You're well-prepared for most mid-level positions",
        "Consider specializing in emerging technologies",
        "Work on building your professional network"
      ];
    } else if (score >= 60) {
      level = "competent";
      recommendations = [
        "You have a solid foundation for entry to mid-level roles",
        "Focus on strengthening your weakest skill areas",
        "Consider taking on more complex projects"
      ];
    } else if (score >= 40) {
      level = "developing";
      recommendations = [
        "Continue building your core skills",
        "Consider additional training or certification",
        "Focus on practical project experience"
      ];
    } else {
      level = "novice";
      recommendations = [
        "Start with foundational courses and tutorials",
        "Build a portfolio of basic projects",
        "Focus on one technology stack initially"
      ];
    }

    // Add specific recommendations based on unchecked skills
    const weakAreas = categories.filter(cat => {
      const checkedCount = cat.skills.filter(skill => skill.checked).length;
      return checkedCount / cat.skills.length < 0.5;
    });

    weakAreas.forEach(area => {
      recommendations.push(`Strengthen your ${area.name.toLowerCase()}`);
    });

    return { score, level, recommendations: recommendations.slice(0, 5) };
  };

  const handleSkillToggle = (categoryId: string, skillId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          skills: category.skills.map(skill => {
            if (skill.id === skillId) {
              return { ...skill, checked: !skill.checked };
            }
            return skill;
          })
        };
      }
      return category;
    }));
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're ready for senior-level opportunities.";
    if (score >= 75) return "Excellent! You're well-prepared for most positions.";
    if (score >= 60) return "Good preparation! Focus on strengthening key areas.";
    if (score >= 40) return "Developing well! Continue building your skills.";
    return "Keep learning! Focus on foundational skills first.";
  };

  const getLevelColor = (level: AssessmentResult["level"]) => {
    switch (level) {
      case "expert": return "text-success-100";
      case "proficient": return "text-primary-100";
      case "competent": return "text-accent-100";
      case "developing": return "text-orange-400";
      case "novice": return "text-destructive-100";
      default: return "text-light-100";
    }
  };

  const getCategoryProgress = (category: SkillCategory) => {
    const checkedCount = category.skills.filter(skill => skill.checked).length;
    return Math.round((checkedCount / category.skills.length) * 100);
  };

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-7xl">
      <nav className="animate-slideUp flex justify-between items-center p-4 bg-dark-200/50 rounded-2xl border border-primary-200/20 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg p-1">
            <Image 
              src="/logo.png" 
              alt="SkillSync Logo" 
              width={45} 
              height={45}
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
      <div className="text-center mb-8 sm:mb-12 animate-fadeIn mt-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Career Readiness Assessment</h1>
        <p className="text-light-100 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Evaluate your professional readiness, identify skill gaps, and get personalized recommendations for career advancement.
        </p>
      </div>

      {/* Assessment Grid */}
      <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar - Score & Results */}
        <div className="lg:col-span-1 space-y-6">
          {/* Score Card */}
          <Card className="card-border sticky top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-center text-lg">Readiness Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center space-y-4">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      className="text-dark-300"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                    />
                    <circle
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                      strokeDasharray={`${readinessScore * 3.14} 314`}
                      className={`transition-all duration-1000 ease-out ${readinessScore >= 75 ? "text-success-100" : readinessScore >= 50 ? "text-primary-100" : "text-accent-100"}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{readinessScore}%</span>
                  </div>
                </div>

                {/* Score Message */}
                <div className="space-y-2">
                  {assessmentResult && (
                    <div className={`text-sm font-medium ${getLevelColor(assessmentResult.level)}`}>
                      {assessmentResult.level.charAt(0).toUpperCase() + assessmentResult.level.slice(1)}
                    </div>
                  )}
                  <p className="text-light-100 text-sm leading-relaxed">{getScoreMessage(readinessScore)}</p>
                </div>

                {/* Calculate Button */}
                <Button onClick={calculateReadiness} className="btn-primary w-full">
                  {readinessScore > 0 ? "Recalculate Score" : "Calculate Score"}
                </Button>

                {/* Action Buttons */}
                {readinessScore > 0 && (
                  <div className="space-y-2 pt-2">
                    <Button asChild variant="outline" className="w-full text-sm">
                      <Link href="/interview">Practice Interview</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full text-sm">
                      <Link href="/roadmap">Create Roadmap</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Tips */}
          <Card className="card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Assessment Tips</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-light-100 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-100 mr-2">•</span>
                  Be honest in your self-assessment
                </li>
                <li className="flex items-start">
                  <span className="text-primary-100 mr-2">•</span>
                  Focus on demonstrable skills
                </li>
                <li className="flex items-start">
                  <span className="text-primary-100 mr-2">•</span>
                  Review and update regularly
                </li>
                <li className="flex items-start">
                  <span className="text-primary-100 mr-2">•</span>
                  Create an action plan for gaps
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Skill Categories */}
        <div className="lg:col-span-3 space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id} className="card-border animate-slideUp" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-light-100">{getCategoryProgress(category)}%</span>
                    <div className="w-16 bg-dark-300 rounded-full h-2">
                      <div 
                        className="bg-primary-100 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${getCategoryProgress(category)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.id} className="group">
                      <div className="flex items-start space-x-3 p-4 rounded-lg bg-dark-200/50 hover:bg-dark-200/70 transition-colors">
                        <Checkbox
                          id={skill.id}
                          checked={skill.checked}
                          onCheckedChange={() => handleSkillToggle(category.id, skill.id)}
                          className="mt-1 flex-shrink-0"
                        />
                        <Label htmlFor={skill.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white group-hover:text-primary-100 transition-colors">
                              {skill.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              skill.level === "advanced" ? "bg-success-100/20 text-success-100" :
                              skill.level === "intermediate" ? "bg-primary-100/20 text-primary-100" :
                              "bg-accent-100/20 text-accent-100"
                            }`}>
                              {skill.level}
                            </span>
                          </div>
                          <div className="text-sm text-light-100 leading-relaxed">{skill.description}</div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Results Section */}
      {showDetailedResults && assessmentResult && (
        <div className="mt-12 space-y-6 animate-fadeIn">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Assessment Results</h2>
            <p className="text-light-100">Detailed analysis and personalized recommendations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Strengths */}
            <Card className="bg-success-100/10 border-success-100/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-success-100 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {categories.flatMap(cat => cat.skills)
                    .filter(skill => skill.checked)
                    .slice(0, 6)
                    .map(skill => (
                      <li key={skill.id} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-success-100 rounded-full mr-3 flex-shrink-0"></span>
                        <span className="text-light-100">{skill.name}</span>
                      </li>
                    ))
                  }
                  {categories.flatMap(cat => cat.skills).filter(skill => skill.checked).length === 0 && (
                    <li className="text-light-100/70 text-sm">Complete the assessment to see your strengths</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-primary-100/10 border-primary-100/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-primary-100 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {assessmentResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-primary-100 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-light-100 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas to Improve */}
            <Card className="bg-accent-100/10 border-accent-100/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-accent-100 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {categories.flatMap(cat => cat.skills)
                    .filter(skill => !skill.checked)
                    .slice(0, 6)
                    .map(skill => (
                      <li key={skill.id} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-accent-100 rounded-full mr-3 flex-shrink-0"></span>
                        <span className="text-light-100">{skill.name}</span>
                      </li>
                    ))
                  }
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <Card className="bg-gradient-to-r from-primary-100/20 to-accent-100/20 border-primary-100/30">
          <CardContent className="py-8">
            <h3 className="text-xl font-bold text-white mb-3">Ready to Take Action?</h3>
            <p className="text-light-100 mb-6 max-w-2xl mx-auto">
              Use your assessment results to create a personalized learning roadmap or practice with our AI-powered interview system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary">
                <Link href="/roadmap">Create Learning Roadmap</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-white">
                <Link href="/interview">Practice Interview Skills</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
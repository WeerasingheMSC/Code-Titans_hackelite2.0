"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export default function CareerReady() {
  const [categories, setCategories] = useState<SkillCategory[]>([
    {
      id: "technical",
      name: "Technical Skills",
      skills: [
        { id: "tech-1", name: "Programming Languages", description: "Proficiency in relevant programming languages", checked: false },
        { id: "tech-2", name: "Frameworks & Libraries", description: "Knowledge of industry-standard frameworks", checked: false },
        { id: "tech-3", name: "Version Control", description: "Experience with Git and collaboration workflows", checked: false },
        { id: "tech-4", name: "Testing", description: "Ability to write and run tests", checked: false },
        { id: "tech-5", name: "Debugging", description: "Proficiency in debugging and problem-solving", checked: false },
      ]
    },
    {
      id: "soft",
      name: "Soft Skills",
      skills: [
        { id: "soft-1", name: "Communication", description: "Clear and effective communication", checked: false },
        { id: "soft-2", name: "Teamwork", description: "Ability to work collaboratively", checked: false },
        { id: "soft-3", name: "Problem Solving", description: "Analytical and critical thinking", checked: false },
        { id: "soft-4", name: "Time Management", description: "Ability to prioritize and meet deadlines", checked: false },
        { id: "soft-5", name: "Adaptability", description: "Willingness to learn and adapt", checked: false },
      ]
    },
    {
      id: "interview",
      name: "Interview Preparation",
      skills: [
        { id: "int-1", name: "Resume Preparation", description: "Well-crafted and tailored resume", checked: false },
        { id: "int-2", name: "Portfolio", description: "Showcase of relevant projects", checked: false },
        { id: "int-3", name: "Technical Questions", description: "Preparation for technical interviews", checked: false },
        { id: "int-4", name: "Behavioral Questions", description: "Preparation for behavioral interviews", checked: false },
        { id: "int-5", name: "Company Research", description: "Knowledge of target companies", checked: false },
      ]
    }
  ]);

  const [readinessScore, setReadinessScore] = useState(0);

  const calculateReadiness = () => {
    const totalSkills = categories.flatMap(cat => cat.skills).length;
    const checkedSkills = categories.flatMap(cat => cat.skills).filter(skill => skill.checked).length;
    const score = Math.round((checkedSkills / totalSkills) * 100);
    setReadinessScore(score);
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
    if (score >= 80) return "Excellent! You're well prepared for your job search.";
    if (score >= 60) return "Good preparation! Focus on the remaining areas to improve.";
    if (score >= 40) return "You're on the right track but need more preparation.";
    return "You need to focus on developing your skills and preparation.";
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-4">Career Readiness Assessment</h1>
        <p className="text-light-100 text-lg">
          Evaluate your readiness for job hunting and identify areas for improvement.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="card-border sticky top-4">
            <CardHeader>
              <CardTitle className="text-white text-center">Your Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="relative w-40 h-40 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle
                      className="text-dark-300"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                    />
                    <circle
                      className="text-primary-100"
                      strokeWidth="10"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                      strokeDasharray={`${readinessScore * 3.14} 314`}
                      transform="rotate(-90 60 60)"
                    />
                    <text
                      x="60"
                      y="65"
                      className="text-2xl font-bold text-white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {readinessScore}%
                    </text>
                  </svg>
                </div>
                <p className="text-light-100">{getScoreMessage(readinessScore)}</p>
                <Button onClick={calculateReadiness} className="btn-primary w-full">
                  Calculate Score
                </Button>
                <div className="pt-4 border-t border-dark-300">
                  <h3 className="font-semibold text-white mb-2">Tips</h3>
                  <ul className="text-sm text-light-100 space-y-1">
                    <li>• Be honest with your self-assessment</li>
                    <li>• Focus on your weakest areas first</li>
                    <li>• Reassess every 2-3 months</li>
                    <li>• Create a plan to address gaps</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id} className="card-border animate-slideUp" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <CardHeader>
                <CardTitle className="text-white">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.id} className="flex items-start space-x-3 p-3 rounded-lg bg-dark-200/50">
                      <Checkbox
                        id={skill.id}
                        checked={skill.checked}
                        onCheckedChange={() => handleSkillToggle(category.id, skill.id)}
                        className="mt-1"
                      />
                      <Label htmlFor={skill.id} className="flex-1 cursor-pointer">
                        <div className="font-medium text-white">{skill.name}</div>
                        <div className="text-sm text-light-100">{skill.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6 animate-fadeIn">
        <Card className="bg-success-100/10 border-success-100/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-success-100 mb-3">Strengths</h3>
            <ul className="text-light-100 space-y-2">
              {categories.flatMap(cat => cat.skills)
                .filter(skill => skill.checked)
                .map(skill => (
                  <li key={skill.id} className="flex items-center">
                    <svg className="w-4 h-4 text-success-100 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {skill.name}
                  </li>
                ))
              }
              {categories.flatMap(cat => cat.skills).filter(skill => skill.checked).length === 0 && (
                <li className="text-light-100/70">No strengths identified yet</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-destructive-100/10 border-destructive-100/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-destructive-100 mb-3">Areas for Improvement</h3>
            <ul className="text-light-100 space-y-2">
              {categories.flatMap(cat => cat.skills)
                .filter(skill => !skill.checked)
                .slice(0, 5)
                .map(skill => (
                  <li key={skill.id} className="flex items-center">
                    <svg className="w-4 h-4 text-destructive-100 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {skill.name}
                  </li>
                ))
              }
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
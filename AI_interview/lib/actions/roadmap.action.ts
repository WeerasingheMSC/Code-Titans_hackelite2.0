"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/firebase/admin";
import { Roadmap, GenerateRoadmapParams } from "@/types";

// Initialize Google Generative AI with error handling
let genAI: GoogleGenerativeAI | null = null;
try {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }
} catch (error) {
  console.error("Failed to initialize Google Generative AI:", error);
}

export async function generateRoadmap(formData: GenerateRoadmapParams): Promise<Roadmap> {
  try {
    const { userId, jobRole, currentPosition, experienceLevel, targetTimeline, skills, goals } = formData;
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    let roadmapContent;

    if (!genAI) {
      console.log("Using mock roadmap data - Gemini not configured");
      // Use mock data if Gemini is not configured
      roadmapContent = getMockRoadmapContent(jobRole, targetTimeline, skills, goals);
    } else {
      try {
        // Use the standard free Gemini model (gemini-pro is the correct free model name)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
          Create a detailed career roadmap for someone who wants to become a ${jobRole}.
          Current position: ${currentPosition}
          Experience level: ${experienceLevel}
          Target timeline: ${targetTimeline}
          Current skills: ${skills.join(', ')}
          Career goals: ${goals.join(', ')}
          
          Please provide a structured roadmap with:
          1. Clear milestones and timeline (aligned with the ${targetTimeline} target)
          2. Specific skills to learn (build upon: ${skills.join(', ')})
          3. Recommended free resources (YouTube tutorials, freeCodeCamp, MDN, etc.)
          4. Practical projects to build
          5. Interview preparation tips
          
          Format the response as valid JSON with this structure:
          {
            "title": "Roadmap to Become ${jobRole}",
            "timeline": "${targetTimeline}",
            "overview": "Brief overview description",
            "milestones": [
              {
                "title": "Milestone name",
                "duration": "Time estimate",
                "description": "What to achieve",
                "skills": ["Skill 1", "Skill 2"],
                "resources": [
                  {
                    "type": "course/book/tutorial",
                    "title": "Resource title",
                    "url": "Resource URL or platform name"
                  }
                ],
                "projects": ["Project idea 1", "Project idea 2"],
                "completed": false
              }
            ],
            "interviewPrep": {
              "technical": ["Topic 1", "Topic 2"],
              "behavioral": ["Question 1", "Question 2"],
              "resources": ["Resource 1", "Resource 2"]
            }
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up the response (Gemini might add markdown formatting)
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        roadmapContent = JSON.parse(cleanText);
        
      } catch (geminiError) {
        console.error("Gemini API error, using mock data:", geminiError);
        // Fall back to mock data if Gemini fails
        roadmapContent = getMockRoadmapContent(jobRole, targetTimeline, skills, goals);
      }
    }

    // Save to Firebase
    const roadmapRef = await db.collection('roadmaps').add({
      userId: userId,
      jobRole: jobRole,
      currentPosition: currentPosition,
      experienceLevel: experienceLevel,
      targetTimeline: targetTimeline,
      skills: skills,
      goals: goals,
      content: roadmapContent,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { 
      id: roadmapRef.id, 
      userId,
      jobRole: jobRole,
      currentPosition: currentPosition,
      experienceLevel: experienceLevel,
      targetTimeline: targetTimeline,
      skills: skills,
      goals: goals,
      content: roadmapContent,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap. Please try again.");
  }
}

// Helper function for mock roadmap data
function getMockRoadmapContent(jobRole: string, timeline: string, skills: string[], goals: string[]) {
  return {
    title: `Roadmap to Become ${jobRole}`,
    timeline: timeline,
    overview: `A step-by-step guide to transition into ${jobRole} role within ${timeline}. Focus on practical skills and projects.`,
    milestones: [
      {
        title: "Foundation & Basics",
        duration: "1-2 months",
        description: "Build fundamental programming skills and understand core concepts",
        skills: ["Programming Fundamentals", "Version Control (Git)", "Basic Algorithms"],
        resources: [
          {
            type: "course",
            title: "freeCodeCamp - Responsive Web Design",
            url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
          },
          {
            type: "tutorial",
            title: "MDN Web Docs - JavaScript Basics",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          }
        ],
        projects: [
          "Personal Portfolio Website",
          "Simple Calculator App",
          "To-Do List Application"
        ],
        completed: false
      },
      {
        title: "Core Technologies & Frameworks",
        duration: "2-3 months",
        description: "Master the essential technologies and frameworks for your role",
        skills: skills.slice(0, 4).length > 0 ? skills.slice(0, 4) : ["React", "Node.js", "Databases", "APIs"],
        resources: [
          {
            type: "course",
            title: "The Odin Project - Full Stack JavaScript",
            url: "https://www.theodinproject.com/paths/full-stack-javascript"
          },
          {
            type: "platform",
            title: "Scrimba - Interactive Coding Platform",
            url: "https://scrimba.com/"
          }
        ],
        projects: [
          "Full-stack CRUD Application",
          "REST API Service",
          "Interactive Web App with User Authentication"
        ],
        completed: false
      },
      {
        title: "Advanced Concepts & Specialization",
        duration: "2-3 months",
        description: "Dive deeper into advanced topics and specialize in your area of interest",
        skills: ["Performance Optimization", "Testing", "Deployment", "System Design"],
        resources: [
          {
            type: "book",
            title: "You Don't Know JS Yet",
            url: "https://github.com/getify/You-Dont-Know-JS"
          },
          {
            type: "platform",
            title: "Frontend Masters - Advanced Courses",
            url: "https://frontendmasters.com/"
          }
        ],
        projects: [
          "Complex Application with Multiple Features",
          "Open Source Contribution",
          "Personal Project Solving Real Problem"
        ],
        completed: false
      },
      {
        title: "Interview Preparation & Job Search",
        duration: "1 month",
        description: "Prepare for technical interviews and optimize your job search strategy",
        skills: ["Problem Solving", "System Design", "Behavioral Interviewing"],
        resources: [
          {
            type: "platform",
            title: "LeetCode - Coding Practice",
            url: "https://leetcode.com/"
          },
          {
            type: "book",
            title: "Cracking the Coding Interview",
            url: "https://www.crackingthecodinginterview.com/"
          }
        ],
        projects: [
          "Interview Preparation Repository",
          "Portfolio Optimization",
          "Networking Strategy"
        ],
        completed: false
      }
    ],
    interviewPrep: {
      technical: [
        "Data Structures & Algorithms",
        "System Design Principles",
        "Database Design",
        "API Design",
        "Testing Strategies"
      ],
      behavioral: [
        "Tell me about yourself",
        "Describe a challenging project",
        "How do you handle conflict?",
        "Where do you see yourself in 5 years?",
        "Why do you want to work here?"
      ],
      resources: [
        "LeetCode for coding practice",
        "Pramp for mock interviews",
        "Glassdoor for company research",
        "LinkedIn for networking"
      ]
    }
  };
}

export async function getUserRoadmaps(userId: string): Promise<Roadmap[]> {
  try {
    // Fetch user roadmaps from Firebase
    const snapshot = await db
      .collection('roadmaps')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const roadmaps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Roadmap[];

    return roadmaps;
  } catch (error) {
    console.error("Error fetching user roadmaps:", error);
    return [];
  }
}

export async function updateRoadmapProgress(roadmapId: string, progress: number): Promise<void> {
  try {
    await db.collection('roadmaps').doc(roadmapId).update({
      progress,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
    throw new Error("Failed to update roadmap progress");
  }
}

export async function getRoadmapById(roadmapId: string): Promise<Roadmap | null> {
  try {
    const doc = await db.collection('roadmaps').doc(roadmapId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt.toDate(),
      updatedAt: doc.data()?.updatedAt.toDate()
    } as Roadmap;
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    throw new Error("Failed to fetch roadmap");
  }
}
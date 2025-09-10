import { z } from 'zod';

export const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewer = {
  name: "AI Interviewer",
  model: {
    provider: "openai",
    model: "gpt-4-turbo",
    systemPrompt: `You are a professional technical interviewer. Conduct a mock interview based on the provided questions. Be thorough but fair in your evaluation.`
  },
  voice: {
    provider: "11labs",
    voiceId: "rachel",
  },
  firstMessage: "Hello! I'm your AI interviewer. Are you ready to begin?",
};

// Add the missing interviewCovers array
export const interviewCovers = [
  "/cover1.jpg",
  "/cover2.jpg",
  "/cover3.jpg",
  // Add more cover paths as needed
];

export const mappings = {
  // Your mappings here
  javascript: "javascript",
  python: "python",
  java: "java",
  // Add more mappings as needed
};
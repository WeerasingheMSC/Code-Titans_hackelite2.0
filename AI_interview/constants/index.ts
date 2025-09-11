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

// Interview cover images available in public/covers directory
export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const mappings = {
  // Programming Languages
  javascript: "javascript",
  python: "python",
  java: "java",
  typescript: "typescript",
  csharp: "csharp",
  cpp: "cplusplus",
  "c++": "cplusplus",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  kotlin: "kotlin",
  swift: "swift",
  dart: "dart",
  
  // Frontend Frameworks & Libraries
  react: "react",
  reactjs: "react",
  vue: "vuejs",
  vuejs: "vuejs",
  angular: "angularjs",
  svelte: "svelte",
  nextjs: "nextjs",
  "next.js": "nextjs",
  nuxtjs: "nuxtjs",
  "nuxt.js": "nuxtjs",
  
  // Backend Frameworks
  nodejs: "nodejs",
  "node.js": "nodejs",
  express: "express",
  expressjs: "express",
  django: "django",
  flask: "flask",
  spring: "spring",
  laravel: "laravel",
  
  // Databases
  mongodb: "mongodb",
  mysql: "mysql",
  postgresql: "postgresql",
  redis: "redis",
  sqlite: "sqlite",
  
  // Cloud & DevOps
  aws: "amazonwebservices",
  docker: "docker",
  kubernetes: "kubernetes",
  terraform: "terraform",
  jenkins: "jenkins",
  
  // Tools & Others
  git: "git",
  github: "github",
  gitlab: "gitlab",
  vscode: "vscode",
  figma: "figma",
  
  // Fallback for unknown technologies
};